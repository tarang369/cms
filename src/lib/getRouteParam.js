export async function getRouteParam(params, key) {
  const resolvedParams = await params;

  if (!resolvedParams || !key) {
    return null;
  }

  if (typeof resolvedParams === "string") {
    try {
      const parsed = JSON.parse(resolvedParams);
      const parsedValue = parsed?.[key];
      return typeof parsedValue === "string" ? parsedValue : null;
    } catch {
      return null;
    }
  }

  const value = resolvedParams?.[key];

  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : null;
  }

  return typeof value === "string" ? value : null;
}
