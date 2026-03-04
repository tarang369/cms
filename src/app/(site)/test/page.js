import { client } from "@/sanity/lib/client";

const query = `
  *[_type=="catalogEntry"]{
    _id,
    title,
    entryKind,
    "slug": slug.current
  }
`;

export default async function TestPage() {
    const data = await client.fetch(query);

    return (
        <div style={{ padding: 20 }}>
            <h1>Catalog Entries</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
