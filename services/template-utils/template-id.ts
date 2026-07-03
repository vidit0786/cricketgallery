export function createTemplateId(prefix = "template") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function dedupeTemplateId(existingIds: Set<string>, requestedId: string) {
  if (!existingIds.has(requestedId)) return requestedId;
  return createTemplateId(requestedId.replace(/-[^-]+$/, ""));
}
