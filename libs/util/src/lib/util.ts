export function objKeysToConstants<T>(
  obj: Record<string, T>
): Record<string, T> {
  const namedConts = {};
  Object.keys(obj || {}).forEach((key) => {
    Object.assign(namedConts, { [key]: key });
  });
  return namedConts;
}
