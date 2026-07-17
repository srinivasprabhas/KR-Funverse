import { site } from "@/data/site";

/** Tiny className joiner (keeps deps minimal). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Build a WhatsApp deep-link with an optional prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.contact.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: link for click-to-call. */
export function telUrl(): string {
  return `tel:+${site.contact.phoneDigits}`;
}

/** mailto: link. */
export function mailtoUrl(subject?: string): string {
  const base = `mailto:${site.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
