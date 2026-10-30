import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

type AdminAuthType = "signup" | "login"

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
  userId: string,
  adminEmail: string,
  type: AdminAuthType,
) => {
  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000"
  const encodedUserId = encodeURIComponent(userId)
  const verifyUrl = `${baseUrl}/api/auth/verify-admin/${encodedUserId}?action=verify&type=${type}`
  const rejectUrl = `${baseUrl}/api/auth/verify-admin/${encodedUserId}?action=reject&type=${type}`

  const actionText = type === "signup" ? "sign up" : "log in"
  const safeAdminEmail = escapeHtml(adminEmail)

  type ApprovalStatus = true | false

  let isApproved: ApprovalStatus = false

  const approveApproval = () => {
    isApproved = true
  }

  const rejectApproval = () => {
    isApproved = false
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administrator access request</title>
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
            <table role="presentation" class="email-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 560px; background-color: #1b1915; border: 1px solid #39352e;">
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
                      <td align="right" valign="middle" style="color: #d6c19b; font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase;">Venue security</td>
                    </tr>
                  </table>

                  <p style="margin: 38px 0 12px; color: #d6c19b; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Administrator review</p>
                  <h1 style="margin: 0; color: #f2ebdd; font-family: 'Manrope', serif; font-size: 30px; font-weight: 600; line-height: 1.2;">Access request</h1>
                  <p style="margin: 17px 0 26px; color: #c9c0b1; font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7;">
                    An administrator has requested to <strong style="color: #f2ebdd; font-weight: 600;">${actionText}</strong>. Review the account details below and choose an action.
                  </p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #11100e; border: 1px solid #39352e;">
                    <tr>
                      <td style="padding: 16px 18px;">
                        <p style="margin: 0 0 7px; color: #a79b89; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">Account email</p>
                        <p style="margin: 0; color: #f2ebdd; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; word-break: break-word;">${safeAdminEmail}</p>
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" class="email-actions" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px;">
                    <tr>
                      <td class="email-action" width="50%" align="left" valign="top">
                        <a href="${verifyUrl}" target="_blank" style="display: block; padding: 14px 12px; background-color: #d6c19b; color: #11100e; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; line-height: 1.2; text-align: center; text-decoration: none;" onclick="approveApproval()">
                          Approve request
                        </a>
                      </td>
                      <td class="email-gap" width="16" style="width: 16px; font-size: 0;">&nbsp;</td>
                      <td class="email-action" width="50%" align="right" valign="top">
                        <a href="${rejectUrl}" target="_blank" style="display: block; padding: 13px 12px; border: 1px solid #75694f; color: #f2ebdd; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; line-height: 1.2; text-align: center; text-decoration: none;" onclick="rejectApproval()">
                          Decline request
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 42px; border-top: 1px solid #39352e; color: #8f8576; font-family: 'Inter', sans-serif; font-size: 10px; line-height: 1.6;">
                  This message was sent automatically by The Matchday. If you were not expecting this request, you can decline it or ignore this email.
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
    from: `"The Matchday | Venue security" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || "archon-eng@gmail.com",
    subject: `Admin ${type === "signup" ? "SignUp" : "LogIn"} Request - ${adminEmail}`,
    html: htmlContent,
  })

  return isApproved
}
