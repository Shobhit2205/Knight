import nodemailer from "nodemailer";
import {google} from "googleapis"

const CLIENT_ID =
  "552547023098-2srevlt2829nk0h4blrn2vo3cbejp7jj.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04XvUmElDw2blCgYIARAAGAQSNwF-L9IrycuIEPtUo3CN4rmcUSsJ6yk7bbQaa6KjPXHdc_EZzGSLGx_WokgWntCnwMipLG6pXvY";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail({ to, sender, subject, html, text }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "tihbohs5022@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Knight <tihbohs5022@gmail.com>",
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    return error;
  }
}

export const sendEmail = async (args) => {
  return sendMail(args);
};
