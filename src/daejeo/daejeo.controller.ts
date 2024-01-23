import { Controller, Get, Query } from '@nestjs/common';
import { DaejeoService } from './daejeo.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('daejeo')
@Controller('daejeo')
export class DaejeoController {
  constructor(private readonly daejeoService: DaejeoService) {}

  @Get()
  @ApiOperation({
    summary: '남은 좌석 확인하기',
    description: '입력 받은 날짜의 좌석 확인하기',
  })
  async getSeatCheck(@Query('date') date: string): Promise<object> {
    // 12/27 => 01/31
    const result = await this.daejeoService.getSeatCheck(date);
    return result;
  }

  @Get('pushMobile')
  @ApiOperation({
    summary: '남은 좌석 확인 후 알람 보내기',
    description:
      '남은 좌석 있는지 5분 동안 체크 후 있으면 알람 보내기 후 종료 ',
  })
  async getSeatCheckPushMobile(@Query('date') date: string): Promise<object> {
    const yourFunction = (i: number) => {
      console.log('fc i :' + i);
      if (i == 5) return true;
      return false;
    };

    let i = 0;
    // 1.5초 마다 실행 하기
    // 5번 실행 또는 빈자리가 있을 경우 멈추기
    const intervalId = setInterval(async () => {
      const count = yourFunction(i);

      // 12/27 => 01/31
      // 빈자리 체크
      const tt: any = await this.daejeoService.getSeatCheckPushMobile(date);
      // 결과값 빈자리 있는지 확인
      const chk = tt.data?.null_seat || 0;
      console.log('true냐 false냐' + count + ' : ' + chk);
      //결과값이 true 일때 종료
      if (count == true || chk > 0) {
        //알람 보내기
        if (chk > 0) {
          //성공 알람
          this.daejeoService.getMobilePush(
            'token',
            '[' + date + ']빈자리 발생 : ' + chk,
          );
        } else {
          //실패 알람
          this.daejeoService.getMobilePush(
            'token',
            '[' + date + ']빈자리 없음 ❌',
          );
        }
        console.log('Function returned true. Stopping interval.');
        clearInterval(intervalId); // Interval 종료
      }
      i++;
    }, 1500);

    return {};
  }

  @Get('dateView')
  @ApiOperation({
    summary: '한달간 남은 좌석 (금토일) 확인하기',
    description: '금일부터 30일 이후까지 남은 자리 확인 하기',
  })
  async getSeatCheckDateView(): Promise<object> {
    return await this.daejeoService.getSeatCheckDateView();
  }
}
