const { google } = require('googleapis');
// const dotenv = require('dotenv');
const nodemailer=require('nodemailer')
// const constants=require('../../constants')
// dotenv.config()
const constants=process.env
const OAuth2 = google.auth.OAuth2;
exports.createTransporter = async () => {
    const oauth2Client = new OAuth2(
      constants.CLIENT_ID,
      constants.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
  
    oauth2Client.setCredentials({
      refresh_token: constants.REFRESH_TOKEN
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: constants.EMAIL_HOST,
        accessToken,
        clientId: constants.CLIENT_ID,
        clientSecret: constants.CLIENT_SECRET,
        refreshToken: constants.REFRESH_TOKEN
      }
    });
  
    return transporter;
  };