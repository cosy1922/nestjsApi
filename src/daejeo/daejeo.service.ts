import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { FcmService } from 'src/fcm/fcm.service';

@Injectable()
export class DaejeoService {
  constructor(private readonly fcmService: FcmService) {}

  //날짜 타입이 맞는지 체크 (2024-01-11)
  isValidDate = (dateString) => {
    // yyyy-mm-dd 형식의 정규 표현식
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

    //형식 확인
    if (!dateString.match(dateFormat)) {
      return false;
    }

    // 입력받은 날짜를 Date 객체로 변환하여 유효한지 확인
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
  };

  //빈자리 체크하기
  async seatCheck(date: string): Promise<object> {
    let result: object = {};
    // ?user_id=&site_id=&site_type=&site_name=&dis_rate=0
    // &user_dis_rate=&reqcode=&reqname=&reqphone=
    // &reservation_type=0&resdate=2023-12-28&schGugun=1
    // &price=0&bagprice=510&allprice=0
    // &percnt=0&g-recaptcha-response=

    await axios
      .get(
        'https://www.daejeocamping.com/reservation/real_time?resdate=' +
          date +
          '&schGugun=1',
      )
      .then((e) => {
        // const htmlString =
        //   '<div><div class="two"><p>Hello, <span>world</span>!</p></div></div>';
        // console.log(e);
        // const $$ = cheerio.load(htmlString);
        //$$
        const $ = cheerio.load(e.data);
        const click_inner = $('.click_inner').find('a');

        //총 자리수
        let total_seat = 0;
        //빈자리 갯수
        let null_seat = 0;
        //예약된 자리 수
        let full_seat = 0;
        //결제대기 자리 수
        let wait_seat = 0;
        //문제 자리
        let err_seat = 0;

        //A,B,C,D자리 확인
        const arr_a = [];
        const arr_b = [];
        const arr_c = [];
        const arr_d = [];
        //click_inner 찾아서 가기
        click_inner.each((index, element) => {
          let siteid = '';
          //A타입B타입C등 종류
          let sitetype = '';
          //A에 몇번째 자리,B의 몇번째 자리
          let sitename = '';
          //금액
          let site_price = '';

          //a 태그 클래스
          const classValue = $(element).attr('class');
          //a 태그 안에 input 가져오기
          const children = $(element).children('input');

          //input 태그 반복문 돌기
          //자리에 대한 정보 값 가져오기
          children.each((idx, element2) => {
            const inputName = $(element2).attr('class');
            if (inputName == 'siteid') {
              siteid = $(element2).val().toString();
              siteid;
            } else if (inputName == 'sitetype') {
              sitetype = $(element2).val().toString();
            } else if (inputName == 'sitename') {
              sitename = $(element2).val().toString();
            } else if (inputName == 'site_price') {
              site_price = $(element2).val().toString();
              site_price;
            }
          });
          //   const el = $(element).text();
          //   console.log(classValue + ' , ' + el);
          //   console.log(index);

          //모든 자리 카운팅
          total_seat = total_seat + 1;
          //자리 수량 체크
          if (classValue.includes('cbtn_on')) {
            //빈 자리
            null_seat = null_seat + 1;
            if (sitetype == 'A') {
              arr_a.push(sitetype + '[' + sitename + ']');
            } else if (sitetype == 'B') {
              arr_b.push(sitetype + '[' + sitename + ']');
            } else if (sitetype == 'C') {
              arr_c.push(sitetype + '[' + sitename + ']');
            } else if (sitetype == 'D') {
              arr_d.push(sitetype + '[' + sitename + ']');
            }
          } else if (classValue.includes('cbtn_Pcomplete')) {
            //예약된 자리
            full_seat = full_seat + 1;
            //예약대기도 있음...
            // cbtn_Pcompleteall
          } else if (classValue.includes('cbtn_Pwaiting')) {
            wait_seat = wait_seat + 1;
          } else {
            err_seat = err_seat + 1;
          }
        });

        result = {
          status: '200',
          message: 'success',
          data: {
            total_seat,
            null_seat,
            full_seat,
            wait_seat,
            err_seat,
            arr_a,
            arr_b,
            arr_c,
            arr_d,
          },
        };
      })
      .catch((err) => {
        result = {
          status: '500',
          message: err,
          data: {},
        };
      });
    return result;
  }

  async getSeatCheck(date: string): Promise<object> {
    // 입력받은 date 유효성 체크
    if (!this.isValidDate(date)) {
      return {
        status: '500',
        message: `${date} is not a valid date.`,
        data: {},
      };
    }

    //자리 체크하기
    const result = await this.seatCheck(date);

    //알람 보내기
    // this.fcmService.pushAllMobile();

    return result;
  }

  async getSeatCheckPushMobile(date: string): Promise<object> {
    // 입력받은 date 유효성 체크
    if (!this.isValidDate(date)) {
      return {
        status: '500',
        message: `${date} is not a valid date.`,
        data: {},
      };
    }

    //자리 체크하기
    const result = await this.seatCheck(date);

    //알람 보내기
    // this.fcmService.pushAllMobile();

    return result;
  }

  async getSeatCheckDateView(): Promise<object> {
    // 현재 날짜 가져오기
    const currentDate = new Date();

    const resultAll: object = {};

    //금토일 확인하기
    const isWeekend = (date) => {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    };

    // 30일 동안의 날짜 출력
    for (let i = 0; i < 30; i++) {
      // 현재 날짜에 i일을 더한 새로운 날짜 계산
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + i);

      // 날짜 출력 (예: "2023-02-20")
      const formattedDate = this.formatDate(futureDate);
      // console.log(`Day ${i + 1}: ${formattedDate}`);

      //금토일 일 경우에만
      if (isWeekend(new Date(formattedDate))) {
        resultAll[formattedDate] = await this.seatCheck(formattedDate);
      }
    }

    return resultAll;
  }

  // 날짜를 "YYYY-MM-DD" 형식으로 포맷하는 함수
  formatDate(date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
