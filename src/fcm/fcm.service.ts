import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tb_mobile_token } from './fcm.entity';
import { Repository } from 'typeorm';
import admin from 'firebase-admin';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(tb_mobile_token)
    private fcmRepository: Repository<tb_mobile_token>,
  ) {}

  async getTokenList(): Promise<any> {
    try {
      const result = await this.fcmRepository.find();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error; // 에러를 다시 던져서 호출 측에서 처리하도록 함
    }
  }

  async pushAllMobile(message: string): Promise<any> {
    try {
      const result = await this.fcmRepository.find();
      const title = '현 Camping 자리';
      const body = message;
      const tokens = [];

      result.forEach((value) => {
        tokens.push(value.token);
        const message = {
          notification: {
            title,
            body,
          },
          token: value.token,
        };
        admin.messaging().send(message);
        //   .then(function (response) {
        //     console.log('Successfully sent message: : ', response);
        //     return 'success';
        //   })
        //   .catch(function (err) {
        //     console.log('Error Sending message!!! : ', err);
        //     return err;
        //   });
      });
    } catch (error) {
      throw error;
    }
  }

  async pushUsersMobile(): Promise<any> {
    try {
      const userid = [
        { userid: '조동현' },
        { userid: '테스트' },
        { userid: 'asd' },
      ];
      const result = await this.fcmRepository.find({
        where: userid,
      });
      console.log(result.length);
      return 'success';
    } catch (err) {
      throw err;
    }
  }
}
