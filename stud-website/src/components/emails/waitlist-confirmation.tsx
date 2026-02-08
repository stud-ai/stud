export function renderWaitlistEmail(email: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#1a1817;">
  <div style="margin-bottom:32px;">
    <span style="font-size:14px;font-weight:600;letter-spacing:0.18em;color:#1a1817;">STUD</span>
  </div>
  <h1 style="font-size:24px;font-weight:400;line-height:1.3;margin:0 0 16px;">You're on the waitlist.</h1>
  <p style="font-size:15px;line-height:1.6;color:#79716b;margin:0 0 24px;">
    We've added <strong style="color:#1a1817;">${email}</strong> to the Stud early-access list. We'll reach out when it's your turn.
  </p>
  <hr style="border:none;border-top:1px solid #e7e5e4;margin:32px 0;" />
  <p style="font-size:12px;color:#a8a29e;margin:0;">Stud — AI coding assistant for Roblox Studio</p>
</div>
</body>
</html>`
}
