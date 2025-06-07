const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const db = admin.firestore();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.checkReminders = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();

  const remindersSnapshot = await db.collection('reminders')
    .where('remindAt', '<=', now)
    .where('sent', '==', false)
    .get();

  const batch = db.batch();

  for (const doc of remindersSnapshot.docs) {
    const data = doc.data();

    const mailOptions = {
      from: gmailEmail,
      to: data.contact,
      subject: `Reminder: ${data.task}`,
      text: `Hi! This is your reminder for: ${data.task}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${data.contact}`);

      batch.update(doc.ref, { sent: true });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  await batch.commit();

  return null;
});
