/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.firestore
  .document('counselingQueries/{queryId}')
  .onCreate(async (snap, context) => {
    const queryData = snap.data();
    const userId = queryData.user;

    // Lấy thông tin người dùng từ Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const userData = userSnapshot.data();

    if (!userData || !userData.fcmToken) {
      console.log('No FCM token found for user:', userId);
      return null;
    }

    const message = {
      notification: {
        title: 'Thông báo tư vấn',
        body: 'Chúng tôi đã nắm bắt được yêu cầu tư vấn của bạn. Trong thời gian ngắn nhất các chuyên gia tư vấn sẽ liên hệ lại và giải quyết các vấn đề bạn đang gặp! See you soon.',
      },
      token: userData.fcmToken,
    };

    return admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return null;
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  });

