const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require('googleapis');
const nodemailer = require("nodemailer");

admin.initializeApp();

const oAuth2Client = new google.auth.OAuth2(
  "1324354770-dtg40alroc4hjsga6119kp528on63nb6.apps.googleusercontent.com",
  "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",
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: "1//042o_9bgAdWt5CgYIARAAGAQSNwF-L9Ir2b__wf_J2AiWTjoYaAkusjruFeKFih5YgX5Bt1D88xb97mUBe63zeIj-9aPYVJjxTBM",
});

async function sendEmail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: 'OAuth2',
        user: "capstonegymapp@gmail.com",
        clientId: "1324354770-dtg40alroc4hjsga6119kp528on63nb6.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//042o_9bgAdWt5CgYIARAAGAQSNwF-L9Ir2b__wf_J2AiWTjoYaAkusjruFeKFih5YgX5Bt1D88xb97mUBe63zeIj-9aPYVJjxTBM",
        accessToken: accessToken.token // Here we are using the fresh access token
      },
      tls: {
        rejectUnauthorized: false // Note: Should be true in production
      }
    });

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Make sure to throw the error so that you can handle it in the calling function
  }
}

exports.sendFeedbackEmail = functions.firestore.document("feedback/{docId}")
  .onCreate(async (snap, context) => {
    const { userName, userEmail, text: feedback } = snap.data();


    // Fetch faculty members' emails
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('isAdmin', '==', true).get();

    if (snapshot.empty) {
      console.log('No faculty members found.');
      return null;
    }

    const facultyEmails = snapshot.docs.map(doc => doc.data().Gmail);
    console.log('Faculty Emails:', facultyEmails);

    // Prepare the email
    const mailOptionsFaculty = {
      from: "capstonegymapp@gmail.com",
      to: facultyEmails, // An array of recipient emails
      subject: "New Feedback Submitted",
      text: `New feedback has been submitted by ${userName} (${userEmail}):\n\n${feedback}`,
    };

    // Send the email
    await sendEmail(mailOptionsFaculty);

    const mailOptionsUsers = {
      from: "capstonegymapp@gmail.com",
      to: userEmail,
      subject: "Thank You For Your Feedback",
      text: `Dear ${userName}, \n\nThank you for your valuable feedback!`
    };

    await sendEmail(mailOptionsUsers)
  });
