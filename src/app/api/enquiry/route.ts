import { NextResponse } from "next/server";

type Enquiry = {
  name?: string;
  phone?: string;
  date?: string;
  group?: string;
  activity?: string;
  message?: string;
};

export async function POST(request: Request) {
  let data: Enquiry;
  try {
    data = (await request.json()) as Enquiry;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!data.name?.trim() || !data.phone?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required." },
      { status: 400 }
    );
  }

  // TODO (owner): wire this up to a real destination — e.g. send an email via
  // Resend/Nodemailer, push to a Google Sheet, or forward to a CRM/WhatsApp API.
  // For now we just log the enquiry server-side so nothing is lost during dev.
  console.log("[KR Funverse enquiry]", {
    ...data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
