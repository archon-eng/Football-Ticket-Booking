import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

const SALT_ROUNDS = 12

// ==========================================
// ENVIRONMENT & UTILITIES
// ==========================================

const getRequiredEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `A required configuration value is unavailable: ${name}. Please contact support to complete the service configuration.`,
    )
  }
  return value
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return entities[character]
  })

// ==========================================
// SECURITY & CRYPTOGRAPHIC AUTHENTICATION
// ==========================================

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS)
  } catch {
    throw new Error(
      "We were unable to securely process the provided credentials. Please try again shortly.",
    )
  }
}

export const verifyPassword = async (
  plainPassword: string,
  storedHash: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, storedHash)
  } catch {
    throw new Error(
      "We were unable to verify the provided credentials at this time. Please try again shortly.",
    )
  }
}

// ==========================================
// EXECUTIVE ACCESS DISPATCH
// ==========================================

export const sendAdminApprovalEmail = async (
  userEmail: string,
  approvalToken: string,
): Promise<void> => {
  const emailTo = getRequiredEnv("EMAIL_TO")
  const emailSender = getRequiredEnv("EMAIL_SENDER")
  const emailSenderPassword = getRequiredEnv("EMAIL_SENDER_PASSWORD")

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSender,
      pass: emailSenderPassword,
    },
  })

  const safeUserEmail = escapeHtml(userEmail)

  const baseUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(
    /\/+$/,
    "",
  )
  const encodedToken = encodeURIComponent(approvalToken)
  const verifyUrl = `${baseUrl}/api/auth/verify-admin/${encodedToken}?action=approve`
  const rejectUrl = `${baseUrl}/api/auth/verify-admin/${encodedToken}?action=reject`

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <title>Administrative Access Authorization | The Matchday</title>
      <style>
        @media only screen and (max-width: 560px) {
          .email-shell { padding: 20px 12px !important; }
          .email-pad { padding: 28px 22px !important; }
          .email-action { display: block !important; width: 100% !important; }
          .email-gap { display: block !important; height: 12px !important; width: 100% !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #11100e; color: #f2ebdd; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background: #11100e;">
        <tr>
          <td class="email-shell" align="center" style="padding: 44px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; background-color: #1b1915; border: 1px solid rgba(242,235,221,0.14); border-radius: 24px; overflow: hidden; box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);">
              <tr>
                <td height="3" style="height: 3px; background: linear-gradient(90deg, #d6c19b 0%, rgba(214,193,155,0.35) 100%); font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="email-pad" style="padding: 40px 42px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td width="42" valign="middle">
                        <div style="width: 36px; height: 36px; border: 1px solid rgba(214,193,155,0.45); border-radius: 10px; color: #d6c19b; font-family: Manrope, Inter, sans-serif; font-size: 17px; font-weight: 700; line-height: 36px; text-align: center;">M</div>
                      </td>
                      <td valign="middle" style="padding-left: 12px;">
                        <p style="margin: 0; color: #f2ebdd; font-family: Manrope, Inter, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em;">THE MATCHDAY</p>
                        <p style="margin: 4px 0 0; color: #a79b89; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;">Private Box Office</p>
                      </td>
                      <td align="right" valign="middle" style="color: #d6c19b; font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;">Executive Security</td>
                    </tr>
                  </table>

                  <p style="margin: 34px 0 12px; color: #d6c19b; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Venue Governance</p>
                  <h1 style="margin: 0; color: #f2ebdd; font-family: Manrope, Inter, sans-serif; font-size: 32px; font-weight: 600; line-height: 1.18; letter-spacing: -0.02em;">Administrative Access Authorization</h1>
                  <p style="margin: 18px 0 26px; color: #c9c0b1; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.75;">
                    A request for <strong style="color: #f2ebdd; font-weight: 600;">elevated administrative access</strong> is awaiting your review. Kindly confirm the applicant details below before granting or declining access.
                  </p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #11100e; border: 1px solid rgba(242,235,221,0.12); border-radius: 14px;">
                    <tr>
                      <td style="padding: 18px 20px;">
                        <p style="margin: 0 0 8px; color: #a79b89; font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;">Applicant Email</p>
                        <p style="margin: 0; color: #f2ebdd; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; word-break: break-word;">${safeUserEmail}</p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" class="email-actions" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                    <tr>
                      <td class="email-action" width="50%" align="left" valign="top">
                        <a href="${escapeHtml(verifyUrl)}" target="_blank" style="display: block; padding: 14px 12px; background-color: #d6c19b; border: 1px solid #d6c19b; border-radius: 999px; color: #11100e; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 700; line-height: 1.2; text-align: center; text-decoration: none;">
                          Approve Access
                        </a>
                      </td>
                      <td class="email-gap" width="16" style="width: 16px; font-size: 0;">&nbsp;</td>
                      <td class="email-action" width="50%" align="right" valign="top">
                        <a href="${escapeHtml(rejectUrl)}" target="_blank" style="display: block; padding: 14px 12px; background-color: transparent; border: 1px solid rgba(242,235,221,0.22); border-radius: 999px; color: #f2ebdd; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 600; line-height: 1.2; text-align: center; text-decoration: none;">
                          Decline Request
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 42px; border-top: 1px solid rgba(242,235,221,0.1); color: #8f8576; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 10px; line-height: 1.7;">
                  This confidential notice was sent automatically by The Matchday. If you do not recognize this request, please decline the authorization promptly.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"The Matchday | Executive Security" <${emailSender}>`,
    to: emailTo,
    subject: `Administrative Access Authorization Required — ${userEmail}`,
    html: htmlContent,
  })
}
