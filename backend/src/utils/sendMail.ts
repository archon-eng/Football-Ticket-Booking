import nodemailer from "nodemailer"

type AdminAuthType = "signup" | "login"

const getRequiredEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`)
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

export const sendAdminApprovalEmail = async (
  userEmail: string,
  userId: string,
  type: AdminAuthType,
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
  const encodedUserId = encodeURIComponent(userId)
  const verifyUrl = `${baseUrl}/api/auth/verify-admin/${encodedUserId}?action=verify&type=${type}`
  const rejectUrl = `${baseUrl}/api/auth/verify-admin/${encodedUserId}?action=reject&type=${type}`

  const actionText =
    type === "signup"
      ? "create an administrator account"
      : "sign in to an administrator account"

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administrator access review | The Matchday</title>
      <style>
        @media only screen and (max-width: 560px) {
          .email-shell { padding: 20px 12px !important; }
          .email-pad { padding: 28px 22px !important; }
          .email-action { display: block !important; width: 100% !important; }
          .email-gap { display: block !important; height: 12px !important; width: 100% !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #11100e; color: #f2ebdd; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #11100e;">
        <tr>
          <td class="email-shell" align="center" style="padding: 44px 20px;">
            <table role="presentation" class="email-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 560px; background-color: #1b1915; border: 1px solid #39352e; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);">
              <tr>
                <td height="3" style="height: 3px; background-color: #d6c19b; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>
              <tr>
                <td class="email-pad" style="padding: 40px 42px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td width="42" valign="middle">
                        <div style="width: 34px; height: 34px; border: 1px solid #75694f; color: #d6c19b; font-family: 'Manrope', serif; font-size: 17px; font-weight: 700; line-height: 34px; text-align: center;">M</div>
                      </td>
                      <td valign="middle" style="padding-left: 10px;">
                        <p style="margin: 0; color: #f2ebdd; font-family: 'Manrope', serif; font-size: 12px; font-weight: 700; letter-spacing: 1px;">THE MATCHDAY</p>
                        <p style="margin: 3px 0 0; color: #a79b89; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;">Ticket house</p>
                      </td>
                      <td align="right" valign="middle" style="color: #d6c19b; font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase;">Secure access review</td>
                    </tr>
                  </table>

                  <p style="margin: 38px 0 12px; color: #d6c19b; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">The Matchday · Venue administration</p>
                  <h1 style="margin: 0; color: #f2ebdd; font-family: 'Manrope', serif; font-size: 30px; font-weight: 600; line-height: 1.2;">Administrator access review</h1>
                  <p style="margin: 17px 0 26px; color: #c9c0b1; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7;">
                    A request to <strong style="color: #f2ebdd; font-weight: 600;">${actionText}</strong> is ready for your review. Confirm the account details below, then approve or decline this request.
                  </p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #11100e; border: 1px solid #39352e; border-radius: 10px;">
                    <tr>
                      <td style="padding: 16px 18px;">
                        <p style="margin: 0 0 7px; color: #a79b89; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">Account email</p>
                        <p style="margin: 0; color: #f2ebdd; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; word-break: break-word;">${safeUserEmail}</p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" class="email-actions" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px;">
                    <tr>
                      <td class="email-action" width="50%" align="left" valign="top">
                        <a href="${escapeHtml(verifyUrl)}" target="_blank" style="display: block; padding: 14px 12px; background-color: #d6c19b; border-radius: 8px; color: #11100e; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; line-height: 1.2; text-align: center; text-decoration: none;">
                          Approve request
                        </a>
                      </td>
                      <td class="email-gap" width="16" style="width: 16px; font-size: 0;">&nbsp;</td>
                      <td class="email-action" width="50%" align="right" valign="top">
                        <a href="${escapeHtml(rejectUrl)}" target="_blank" style="display: block; padding: 13px 12px; border: 1px solid #75694f; border-radius: 8px; color: #f2ebdd; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; line-height: 1.2; text-align: center; text-decoration: none;">
                          Decline request
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 42px; border-top: 1px solid #39352e; color: #8f8576; font-family: 'Inter', sans-serif; font-size: 10px; line-height: 1.6;">
                  The Matchday generated this notice automatically. If you were not expecting this request, you may decline it or ignore this email.
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
    from: `"The Matchday | Access review" <${emailSender}>`,
    to: emailTo,
    subject: `Administrator ${type === "signup" ? "account" : "sign-in"} access review - ${userEmail}`,
    html: htmlContent,
  })
}
