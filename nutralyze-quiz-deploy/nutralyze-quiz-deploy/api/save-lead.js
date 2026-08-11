import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, planText, products } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const productList = Array.isArray(products) ? products : [];

  const dbUrl = process.env.DATABASE_URL;
  const resendKey = process.env.RESEND_API_KEY;

  // 1. Save lead to database (non-fatal if it fails — we still try to send the email)
  let dbError = null;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await sql`
        INSERT INTO leads (email, plan_text, products_json)
        VALUES (${email}, ${planText || ""}, ${JSON.stringify(productList)})
      `;
    } catch (err) {
      dbError = err.message;
      console.error("DB insert error:", err);
    }
  } else {
    dbError = "DATABASE_URL not set";
  }

  // 2. Build the email HTML — plan text + clickable affiliate product cards
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  const planHtml = escapeHtml(planText || "Thanks for completing the Nutralyze quiz!")
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 16px;line-height:1.6;color:#1a1a1a;">${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const productsHtml = productList.length
    ? `
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e2e2;">
      <div style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#00937a;margin-bottom:14px;">
        Recommended for you
      </div>
      ${productList
        .map(
          (p) => `
        <div style="margin-bottom:12px;padding:14px 16px;border:1px solid #e2e2e2;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#00937a;margin-bottom:4px;">${escapeHtml(p.tag || "")}</div>
          <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
          <div style="font-size:13px;color:#666;margin-bottom:10px;">${escapeHtml(p.benefit || "")}</div>
          <a href="${p.url}" style="display:inline-block;background:#00c9a7;color:#000;text-decoration:none;font-size:13px;font-weight:700;padding:8px 16px;border-radius:6px;">View product →</a>
        </div>`
        )
        .join("")}
      <div style="font-size:11px;color:#999;margin-top:12px;line-height:1.5;">
        As an Amazon Associate, Nutralyze earns from qualifying purchases. This does not affect our recommendations.
      </div>
    </div>`
    : "";

  const emailHtml = `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <div style="font-size:20px;font-weight:800;margin-bottom:4px;">Nutra<span style="color:#00937a;">lyze</span></div>
      <div style="font-size:13px;color:#666;margin-bottom:24px;">Your 30-Day Wellness Plan</div>
      ${planHtml}
      ${productsHtml}
      <div style="font-size:11px;color:#999;margin-top:24px;line-height:1.5;">
        Informational only — not medical advice. Consult a healthcare professional before starting any new supplement.
      </div>
    </div>`;

  // 3. Send the email via Resend (non-fatal if it fails — we still report DB status)
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
          from: "Nutralyze <hello@nutralyze.health>",
          to: email,
          subject: "Your Nutralyze 30-Day Wellness Plan",
          html: emailHtml,
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
