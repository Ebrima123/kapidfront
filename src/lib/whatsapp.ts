/** Pre-filled first message, so the owner can tell chats came from the website. */
export const WHATSAPP_GREETING = "Hello Kapid Painting Company, I'd like to ask about a painting job.";

/**
 * Build a wa.me chat link from the number entered in the dashboard, or null when
 * there is no usable number (the WhatsApp buttons then stay hidden).
 */
export function whatsappHref(number: string | null | undefined, text = WHATSAPP_GREETING): string | null {
  if (!number) return null;
  let digits = number.replace(/\D/g, "");
  // "00" is an international prefix only when a full number follows it (e.g. 00220…).
  if (digits.startsWith("00") && digits.length > 9) digits = digits.slice(2);
  // A 7-digit Gambian number entered without its country code.
  if (digits.length === 7) digits = `220${digits}`;
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
