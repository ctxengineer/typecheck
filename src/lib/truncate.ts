/**
 * Regex to match object type definitions with semicolons
 * Matches: { anything; } (with balanced braces)
 */
const OBJECT_WITH_SEMICOLON = /\{ [^{}]*(?:\{ [^{}]*\}[^{}]*)* \}/g;

/**
 * Parse object content into key-value pairs
 * Handles nested braces by tracking depth
 */
function parseObjectProperties(
  content: string
): Array<{ key: string; value: string }> {
  const properties: Array<{ key: string; value: string }> = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === "{") depth++;
    if (char === "}") depth--;

    // Split on "; " at depth 0
    if (depth === 0 && char === ";" && content[i + 1] === " ") {
      if (current.trim()) {
        const colonIdx = current.indexOf(":");
        if (colonIdx !== -1) {
          properties.push({
            key: current.substring(0, colonIdx).trim(),
            value: current.substring(colonIdx + 1).trim(),
          });
        }
      }
      current = "";
      i++; // skip the space after semicolon
    } else if (depth === 0 && char === ";" && i === content.length - 1) {
      // Handle trailing semicolon
      if (current.trim()) {
        const colonIdx = current.indexOf(":");
        if (colonIdx !== -1) {
          properties.push({
            key: current.substring(0, colonIdx).trim(),
            value: current.substring(colonIdx + 1).trim(),
          });
        }
      }
      current = "";
    } else {
      current += char;
    }
  }

  // Handle any remaining content
  if (current.trim()) {
    const colonIdx = current.indexOf(":");
    if (colonIdx !== -1) {
      properties.push({
        key: current.substring(0, colonIdx).trim(),
        value: current.substring(colonIdx + 1).trim(),
      });
    }
  }

  return properties;
}

/**
 * Truncate an object, keeping the longest key visible
 */
function truncateObject(objectStr: string): string {
  // Extract content between { and }
  const content = objectStr.slice(2, -2); // Remove "{ " and " }"

  // Check if this object has semicolons (properties)
  if (!content.includes(";")) {
    return objectStr;
  }

  const properties = parseObjectProperties(content);
  if (properties.length === 0) {
    return "{ ... }";
  }

  // Find the property with the longest key (first wins on tie)
  let longestProp = properties[0]!;
  for (const prop of properties) {
    if (prop.key.length > longestProp.key.length) {
      longestProp = prop;
    }
  }

  // If the value contains a nested object with semicolons, truncate it
  let value = longestProp.value;
  const valueHasNestedObject = value.includes("{ ") && value.includes("; }");
  if (valueHasNestedObject) {
    value = value.replace(OBJECT_WITH_SEMICOLON, "{ ... }");
  }

  // Only add "... " if there are other keys or the value was a nested object
  const hasOtherContent = properties.length > 1 || valueHasNestedObject;
  const suffix = hasOtherContent ? " ..." : "";

  return `{ ${longestProp.key}: ${value};${suffix} }`;
}

/**
 * Truncate complex object types in a TypeScript type string
 *
 * Keeps the longest key visible with its value:
 * - If value is primitive: show as-is
 * - If value is an object: truncate the nested object
 *
 * Examples:
 * - '{ foo: string; }' -> '{ foo: string; }' (single key, no ellipsis)
 * - '{ a: number; longKey: string; }' -> '{ longKey: string; ... }' (multiple keys)
 * - '{ data: { nested: any; }; }' -> '{ data: { ... }; ... }' (nested object)
 *
 * @param typeStr The type string to truncate
 * @returns The truncated type string
 */
export function truncateType(typeStr: string): string {
  return typeStr.replace(OBJECT_WITH_SEMICOLON, truncateObject);
}
