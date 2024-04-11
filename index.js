const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: 'OAuth2',
    user: "capstonegymapp@gmail.com", // The email you will use to send messages
    clientId: "1324354770-dtg40alroc4hjsga6119kp528on63nb6.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//045CpGSIiwQ-lCgYIARAAGAQSNwF-L9IrIhroctsOOQxwjJv93ADy4hVi-_yRc5MvleQBCsLjsvE5FzuF95OQWr5msiLVLYBHlRc",
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendFeedbackEmail = functions.firestore.document("feedback/{docId}")
  .onCreate(async (snap, context) => {
    const feedback = snap.data().text; // The content of the feedback

    try {
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
      const mailOptions = {
        from: "capstonegymapp@gmail.com",
        to: facultyEmails, // An array of recipient emails
        subject: "New Feedback Submitted",
        text: `New feedback has been submitted:\n\n${feedback}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
