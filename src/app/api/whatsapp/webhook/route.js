import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  extractProductSnapshotFromMessage,
  parseFutureOutreachConsent,
} from "@/lib/whatsapp";
import { serverClient } from "@/sanity/lib/serverClient";

export const runtime = "nodejs";

const META_PROVIDER = "metaCloudApi";
const CATALOG_ENTRY_BY_SLUG_QUERY = `
  *[_type == "catalogEntry" && slug.current == $slug][0]{
    _id
  }
`;

function buildLeadDocumentId(messageId, fallbackValue) {
  const sanitizedMessageId = String(messageId || "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .slice(0, 120);

  if (sanitizedMessageId) {
    return `whatsapp-lead-${META_PROVIDER}-${sanitizedMessageId}`;
  }

  const fallbackHash = crypto
    .createHash("sha256")
    .update(fallbackValue)
    .digest("hex")
    .slice(0, 24);

  return `whatsapp-lead-${META_PROVIDER}-${fallbackHash}`;
}

function getWebhookVerifyToken() {
  return process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "";
}

function getWhatsAppAppSecret() {
  return process.env.WHATSAPP_APP_SECRET || "";
}

function verifyMetaSignature(rawBody, signatureHeader) {
  const appSecret = getWhatsAppAppSecret();

  if (!appSecret || !signatureHeader) {
    return false;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex")}`;
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function getInboundMessageEvents(payload) {
  return (payload?.entry || []).flatMap((entry) =>
    (entry?.changes || []).flatMap((change) => {
      if (
        change?.field !== "messages" ||
        !Array.isArray(change?.value?.messages) ||
        change.value.messages.length === 0
      ) {
        return [];
      }

      return change.value.messages.map((message) => ({
        entry,
        change,
        value: change.value,
        message,
      }));
    }),
  );
}

function getContactForMessage(value, message) {
  const contacts = Array.isArray(value?.contacts) ? value.contacts : [];

  return (
    contacts.find((contact) => contact?.wa_id === message?.from) ||
    contacts[0] ||
    null
  );
}

function extractInboundMessageText(message) {
  if (!message?.type) {
    return "";
  }

  if (message.type === "text") {
    return message?.text?.body || "";
  }

  if (message.type === "button") {
    return message?.button?.text || "";
  }

  if (message.type === "interactive") {
    return (
      message?.interactive?.button_reply?.title ||
      message?.interactive?.list_reply?.title ||
      ""
    );
  }

  return "";
}

function getReceivedAt(timestamp) {
  const numericTimestamp = Number(timestamp);

  if (Number.isFinite(numericTimestamp) && numericTimestamp > 0) {
    return new Date(numericTimestamp * 1000).toISOString();
  }

  return new Date().toISOString();
}

function normalizeLeadSource(source) {
  return (
    String(source || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "product_whatsapp_cta"
  );
}

async function findCatalogEntryReference(slug) {
  if (!slug) {
    return undefined;
  }

  const catalogEntry = await serverClient.fetch(CATALOG_ENTRY_BY_SLUG_QUERY, {
    slug,
  });

  if (!catalogEntry?._id) {
    return undefined;
  }

  return {
    _type: "reference",
    _ref: catalogEntry._id,
  };
}

async function buildLeadDocument(event, rawBody) {
  const { value, message } = event;
  const messageBody = extractInboundMessageText(message);
  const productSnapshot = extractProductSnapshotFromMessage(messageBody);
  const futureOutreachConsent = parseFutureOutreachConsent(messageBody);
  const contact = getContactForMessage(value, message);
  const receivedAt = getReceivedAt(message?.timestamp);
  const catalogEntry = await findCatalogEntryReference(productSnapshot.slug);

  return {
    _id: buildLeadDocumentId(
      message?.id,
      `${message?.from || ""}:${message?.timestamp || ""}:${messageBody}`,
    ),
    _type: "whatsappLead",
    provider: META_PROVIDER,
    source: normalizeLeadSource(productSnapshot.source),
    receivedAt,
    messageId: message?.id || "",
    messageType: message?.type || "unknown",
    profileName: contact?.profile?.name || "",
    phoneNumber: message?.from || contact?.wa_id || "",
    waId: contact?.wa_id || message?.from || "",
    messageBody,
    catalogEntry,
    productSnapshot: {
      title: productSnapshot.title || "",
      category: productSnapshot.category || "",
      brand: productSnapshot.brand || "",
      code: productSnapshot.code || "",
      slug: productSnapshot.slug || "",
      url: productSnapshot.url || "",
    },
    consent: {
      customerInitiated: true,
      replyBasis: "customer_initiated_message",
      futureOutreachStatus: futureOutreachConsent.status,
      futureOutreachText: futureOutreachConsent.text,
      capturedAt: receivedAt,
    },
    rawPayload: rawBody,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (!getWebhookVerifyToken()) {
    return NextResponse.json(
      { error: "Missing WHATSAPP_WEBHOOK_VERIFY_TOKEN" },
      { status: 500 },
    );
  }

  if (mode !== "subscribe" || !challenge) {
    return NextResponse.json({ error: "Invalid webhook verification request" }, { status: 400 });
  }

  if (verifyToken !== getWebhookVerifyToken()) {
    return NextResponse.json({ error: "Invalid webhook verification token" }, { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN" },
      { status: 500 },
    );
  }

  if (!getWhatsAppAppSecret()) {
    return NextResponse.json(
      { error: "Missing WHATSAPP_APP_SECRET" },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get("x-hub-signature-256");
  const rawBody = await request.text();

  if (!verifyMetaSignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let payload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const inboundMessageEvents = getInboundMessageEvents(payload);

  if (inboundMessageEvents.length === 0) {
    return NextResponse.json({ received: true, stored: 0 });
  }

  try {
    const leadDocuments = await Promise.all(
      inboundMessageEvents.map((event) => buildLeadDocument(event, rawBody)),
    );

    await Promise.all(
      leadDocuments.map((document) => serverClient.createIfNotExists(document)),
    );

    return NextResponse.json({
      received: true,
      stored: leadDocuments.length,
    });
  } catch (error) {
    console.error("Failed to store WhatsApp lead webhook payload", error);

    return NextResponse.json(
      { error: "Failed to store WhatsApp leads" },
      { status: 500 },
    );
  }
}
