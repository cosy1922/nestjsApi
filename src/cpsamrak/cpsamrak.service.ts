import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class CpsamrakService {
  async getSeatCheck(): Promise<string> {
    console.log('asdasd');
    await axios
      .get('https://www.daejeocamping.com/reservation/real_time')
      .then((e) => {
        // const htmlString =
        //   '<div><div class="two"><p>Hello, <span>world</span>!</p></div></div>';
        // console.log(e);
        // const $$ = cheerio.load(htmlString);
        //$$
        const $ = cheerio.load(e.data);
        const click_inner = $('.click_inner').find('a');

        //click_inner 찾아서 가기
        click_inner.each((index, element) => {
          //a 태그 클래스
          const classValue = $(element).attr('class');
          //a 태그 안에 input 가져오기
          const children = $(element).children('input');
          console.log('-----> <-----');
          children.each((idx, element2) => {
            console.log($(element2).attr('class') + $(children).length);
          });
          const el = $(element).text();
          console.log(classValue + ' , ' + el);
        });

        // console.log($$('.res_click_map').children('.click_inner').text());
        // console.log('-->');
        // console.log($$('.click_inner').find('*'));

        // const $ = cheerio.load(e.toString());
      })
      .catch((err) => {
        throw err;
      });
    return 'success';
  }
}
