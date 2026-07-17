"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { attractions, site } from "@/data/site";
import { whatsappUrl } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const initial = {
  name: "",
  phone: "",
  date: "",
  group: "",
  activity: "",
  message: "",
};

export default function EnquiryForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const waMessage = `Hi ${site.name}! I'd like to book a session.
Name: ${form.name || "-"}
Phone: ${form.phone || "-"}
Preferred date: ${form.date || "-"}
Group size: ${form.group || "-"}
Activity: ${form.activity || "-"}
${form.message ? `Note: ${form.message}` : ""}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/12 bg-ink/60 px-4 py-3 text-chalk placeholder:text-ash outline-none transition-colors focus:border-racing focus:ring-1 focus:ring-racing";

  return (
    <div className="relative rounded-2xl border border-white/10 bg-carbon p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <CheckCircle2 className="text-green-400" size={56} />
            <h3 className="mt-5 font-display text-3xl uppercase tracking-wide text-chalk">
              Request sent!
            </h3>
            <p className="mt-2 max-w-sm text-smoke">
              Thanks{form.name ? "" : ""}! We&apos;ll be in touch shortly. For a faster response, message
              us on WhatsApp.
            </p>
            <a
              href={whatsappUrl(`Hi ${site.name}, I just sent an enquiry through your website.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-display text-lg uppercase tracking-widest text-white"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-ash underline-offset-4 hover:text-chalk hover:underline"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-smoke">
                Name *
              </label>
              <input
                id="name"
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm text-smoke">
                Phone *
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="10-digit mobile"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm text-smoke">
                Preferred date
              </label>
              <input
                id="date"
                type="date"
                className={`${inputClass} [color-scheme:dark]`}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="group" className="mb-1.5 block text-sm text-smoke">
                Group size
              </label>
              <input
                id="group"
                type="number"
                min={1}
                className={inputClass}
                value={form.group}
                onChange={(e) => update("group", e.target.value)}
                placeholder="e.g. 4"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="activity" className="mb-1.5 block text-sm text-smoke">
                Activity
              </label>
              <select
                id="activity"
                className={`${inputClass} [color-scheme:dark]`}
                value={form.activity}
                onChange={(e) => update("activity", e.target.value)}
              >
                <option value="">Not sure yet</option>
                {attractions.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
                <option value="Multiple / Group package">Multiple / Group package</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-1.5 block text-sm text-smoke">
                Message
              </label>
              <textarea
                id="message"
                rows={3}
                className={inputClass}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your plan…"
              />
            </div>

            {status === "error" && (
              <p className="sm:col-span-2 text-sm text-racing">
                Please add at least your name and phone number, then try again.
              </p>
            )}

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-racing px-6 py-3.5 font-display text-xl uppercase tracking-widest text-white transition hover:brightness-110 disabled:opacity-70 glow-racing"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Request
                  </>
                )}
              </button>
              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-display text-xl uppercase tracking-widest text-chalk transition-colors hover:border-flag hover:text-flag"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
