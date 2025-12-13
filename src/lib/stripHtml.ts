/**
 * Strip HTML tags from rich text content
 * Used to display plain text from the CMS rich text editor
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
