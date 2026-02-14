export function renderWaitlistEmail(email: string): string {
  const site = "https://trystud.me"
  const mail = email
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Stud waitlist</title>
</head>
<body style="margin:0;padding:0;background:#f6f7f9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">You're in. We'll email you as soon as your Stud access opens up.</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:22px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.16em;color:#111827;">STUD</td>
                  <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">waitlist confirmed</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 24px 0 24px;">
              <img src="${site}/assets/redwoods-2.png" alt="Stud product preview" width="572" style="display:block;width:100%;max-width:572px;height:auto;border-radius:14px;border:1px solid #e5e7eb;" />
            </td>
          </tr>

          <tr>
            <td style="padding:26px 24px 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
              <h1 style="margin:0;font-size:30px;line-height:1.2;font-weight:600;">You're officially in.</h1>
              <p style="margin:14px 0 0 0;font-size:16px;line-height:1.65;color:#4b5563;">
                We added <strong style="color:#111827;">${mail}</strong> to the Stud early-access list.
                As soon as your invite opens, you'll be first to know.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:0 10px 10px 0;">
                    <span style="display:inline-block;padding:8px 12px;border-radius:999px;background:#f3f4f6;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;">27+ Roblox tools</span>
                  </td>
                  <td style="padding:0 10px 10px 0;">
                    <span style="display:inline-block;padding:8px 12px;border-radius:999px;background:#f3f4f6;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;">Terminal-native workflow</span>
                  </td>
                  <td style="padding:0 0 10px 0;">
                    <span style="display:inline-block;padding:8px 12px;border-radius:999px;background:#f3f4f6;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;">Open source</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 24px 0 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">
                <tr>
                  <td style="padding:0 0 18px 0;">
                    <img src="${site}/assets/app_icon.png" alt="Stud icon" width="48" height="48" style="display:block;border-radius:12px;border:1px solid #e5e7eb;" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${site}/docs/getting-started" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;line-height:1;padding:12px 16px;border-radius:10px;">Preview setup docs</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 24px 24px 24px;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#9ca3af;">
                Sent by Stud • <a href="${site}" target="_blank" rel="noopener noreferrer" style="color:#6b7280;text-decoration:underline;">trystud.me</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
