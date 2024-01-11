// import * as admin from 'firebase-admin';

// admin.initializeApp();

// export const sendFirebaseNotification = functions.https.onRequest(
//   async (req, res) => {
//     // 사용자의 FCM 토큰과 알람 메시지 데이터를 요청에서 추출
//     const registrationToken = req.body.registrationToken;
//     const data = req.body.data;

//     console.log(registrationToken);
//     console.log(data);

//     // 알람 메시지 생성
//     const message = {
//       data: data,
//       token: registrationToken,
//     };

//     try {
//       const response = await admin.messaging().send(message);
//       return res.status(200).json({ success: true, response });
//     } catch (error) {
//       return res.status(500).json({ success: false, error });
//     }
//   },
// );
