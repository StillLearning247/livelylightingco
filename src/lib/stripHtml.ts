/**
 * Decode HTML entities in a string
 */
const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
};

/**
 * Strip HTML tags from rich text content
 * Used to display plain text from the CMS rich text editor
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";

  // First decode any HTML entities (handles double-encoded content)
  let decoded = decodeHtmlEntities(html);

  // If we decoded entities that look like tags, decode again
  if (decoded.includes("&lt;") || decoded.includes("&gt;")) {
    decoded = decodeHtmlEntities(decoded);
  }

  // Use DOM parser to strip tags (most reliable)
  if (typeof document !== "undefined") {
    try {
      const tmp = document.createElement("div");
      tmp.innerHTML = decoded;
      const text = tmp.textContent || tmp.innerText || "";
      return text.trim().replace(/\s+/g, " ");
    } catch {
      // Fall through to regex approach
    }
  }

  // Fallback: regex-based stripping
  return decoded
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .trim()
    .replace(/\s+/g, " ");   // Normalize whitespace
};
