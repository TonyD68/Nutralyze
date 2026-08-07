import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, planText } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  const resendKey = process.env.RESEND_API_KEY;

  // 1. Save lead to database (non-fatal if it fails — we still try to send the email)
  let dbError = null;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await sql`
        INSERT INTO leads (email, plan_text)
        VALUES (${email}, ${planText || ""})
      `;
    } catch (err) {
      dbError = err.message;
      console.error("DB insert error:", err);
    }
  } else {
    dbError = "DATABASE_URL not set";
  }

  // 2. Send the email via Resend (non-fatal if it fails — we still report DB status)
  let emailError = null;
  if (resendKey) {
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Nutralyze <onboarding@resend.dev>",
          to: email,
          subject: "Your Nutralyze 30-Day Wellness Plan",
          text: planText || "Thanks for completing the Nutralyze quiz! Your plan will follow shortly.",
        }),
      });
      if (!emailResponse.ok) {
        emailError = await emailResponse.text();
      }
    } catch (err) {
      emailError = err.message;
    }
  } else {
    emailError = "RESEND_API_KEY not set";
  }

  res.status(200).json({
    ok: true,
    savedToDb: !dbError,
    emailSent: !emailError,
    dbError,
    emailError,
  });
}
