import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
// import serviceAccount from './firebasekey';

import Key from '../../firebase-adminsdk';

import FirebaseTokenGenerator from 'firebase-token-generator';
import { getMessaging, getToken } from 'firebase/messaging';
import key from '../../firebase-adminsdk';

@Injectable()
export class MachineService {
  constructor(private http: HttpService) {}

  getTest(): any {
    admin.initializeApp({
      credential: admin.credential.cert(Key as ServiceAccount),
    });

    const messaging = getMessaging();

    const mytoken = getToken(messaging, {
      vapidKey:
        'BDJxfsfM662WP6EuOpb-Djp8QnHeeuOAJ31EsyjUUvwBNIlMRRMOFzCMIPrW1VVZ-pVM2MNhsKCkMOTnxDaKLpM',
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.log(currentToken);
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.',
          );
          // ...
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });

    console.log('my token 11?');
    console.log(mytoken);

    const tokenGenerator = new FirebaseTokenGenerator(key);
    const token = tokenGenerator.createToken({
      uid: '1',
      some: 'arbitrary',
      data: 'here',
    });

    console.log(token);

    return this.getPush();
    // return 'service rtn';
  }

  getPush(): any {
    const deviceToken =
      'eqXbZbn4TCyVyWEvV_DsIf:APA91bGjiUAqg7VHCTpsbnTk7j79LhDeQ6XWAxKkJg_3rjg943QxBWkQSiZOpES3K3rbMuVeRJINH04W4MejgXEwMMI1O21hheg6GLxasAcI2wgSLKk1cYC8-7WYpEmFJogDcqTNmUc0=';
    const message = {
      notification: {
        title: '테스트 발송',
        body: '로또 현 알람!',
      },
      token: deviceToken,
    };

    admin
      .messaging()
      .send(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response);
        return 'success';
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
        return err;
      });
  }

  getPush2(): any {
    const message = {
      android: {
        data: {
          title: '김루희 똥방구',
          body: '어쩔티비 저쩔티미 우짤레미 저짤레미 눼눼눼눼 아무말도 못하쥬?',
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            alert: {
              title: '김루희 똥방구',
              body: '어쩔티비 저쩔티미 우짤레미 저짤레미 눼눼눼눼 아무말도 못하쥬?',
            },
          },
        },
      },
      tokens: [
        'eqXbZbn4TCyVyWEvV_DsIf:APA91bGjiUAqg7VHCTpsbnTk7j79LhDeQ6XWAxKkJg_3rjg943QxBWkQSiZOpES3K3rbMuVeRJINH04W4MejgXEwMMI1O21hheg6GLxasAcI2wgSLKk1cYC8-7WYpEmFJogDcqTNmUc0',
        'eqXbZbn4TCyVyWEvV_DsIf:APA91bGjiUAqg7VHCTpsbnTk7j79LhDeQ6XWAxKkJg_3rjg943QxBWkQSiZOpES3K3rbMuVeRJINH04W4MejgXEwMMI1O21hheg6GLxasAcI2wgSLKk1cYC8-7WYpEmFJogDcqTNmUc0=',
      ],
      Notification: {
        title: '제목',
        body: '바디',
      },
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then(function (res) {
        console.log('Successfully sent message: : ', res);
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
      });
  }
}
