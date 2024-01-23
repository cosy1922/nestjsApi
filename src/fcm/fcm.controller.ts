import { Controller, Get } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fcm')
@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Get('getTokenList')
  async getTokenList(): Promise<any> {
    //전체 token 가져오기
    return await this.fcmService.getTokenList();
  }

  @Get('pushAllMobile')
  async pushAllMobile(): Promise<any> {
    return await this.fcmService.pushAllMobile('message input');
  }

  @Get('pushUsersMobile')
  async pushUsersMobile(): Promise<any> {
    return await this.fcmService.pushUsersMobile();
  }
}
