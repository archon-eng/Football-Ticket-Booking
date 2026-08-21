import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

type AdminAuthType = "signup" | "login"

export const sendAdminApprovalEmail = async (
  userId: string,
  adminEmail: string,
  type: AdminAuthType,
) => {
  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000"
  const verifyUrl = `${baseUrl}/api/auth/verify-admin/${userId}?action=verify&type=${type}`
  const rejectUrl = `${baseUrl}/api/auth/verify-admin/${userId}?action=reject&type=${type}`

  const actionText = type === "signup" ? "sign up" : "log in"

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin ${type === "signup" ? "SignUp" : "LogIn"} Verification</title>
      <style>
        @font-face {
          font-family: "Google Sans Flex";
          src: url("../../public/fonts/Google_Sans_Flex.ttf") format("truetype");
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
        }

        * {
          font-family: "Google Sans Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #121212; color: #e6e1e5; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #121212; width: 100%; padding: 32px 16px;">
        <tr>
          <td align="center">
            
            <!-- M3 Container / Card -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 480px; background-color: #2b2930; border-radius: 24px; border: 1px solid #49454f; overflow: hidden;">
              
              <!-- Content Block -->
              <tr>
                <td style="padding: 24px;">
                  <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 22px; color: #e6e1e5;">
                    An admin wants to <strong style="font-weight: 700;">${actionText}</strong>. Verify the following credentials:
                  </p>
                  
                  <!-- Inset Credential Box -->
                  <div style="background-color: #1c1b1f; border-radius: 12px; padding: 12px 16px; border: 1px solid #49454f; font-size: 14px; color: #d0bcff; margin-bottom: 24px;">
                    Email: ${adminEmail}
                  </div>

                  <!-- Action Buttons -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <!-- Verify Button (M3 Primary Filled) -->
                      <td width="48%" align="left">
                        <a href="${verifyUrl}" target="_blank" style="display: block; text-align: center; background-color: #d0bcff; color: #381e72; font-size: 14px; font-weight: 600; text-decoration: none; padding: 10px 16px; border-radius: 100px; box-sizing: border-box;">
                          Verify
                        </a>
                      </td>
                      
                      <td width="4%"></td>
                      
                      <!-- Reject Button (M3 Error Tonal) -->
                      <td width="48%" align="right">
                        <a href="${rejectUrl}" target="_blank" style="display: block; text-align: center; background-color: #601410; color: #f2b8b5; border: 1px solid #8c1d18; font-size: 14px; font-weight: 600; text-decoration: none; padding: 10px 16px; border-radius: 100px; box-sizing: border-box;">
                          Reject
                        </a>
                      </td>
                    </tr>
                  </table>

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
    from: `"System Security" <${process.env.EMAIL_USER}>`,
    to: "m.abdurrahman.swe@gmail.com",
    subject: `Admin ${type === "signup" ? "SignUp" : "LogIn"} Request - ${adminEmail}`,
    html: htmlContent,
  })
}
