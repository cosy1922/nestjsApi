import { Controller, Get } from '@nestjs/common';
import { CpsamrakService } from './cpsamrak.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('samrak')
@Controller('cpsamrak')
export class CpsamrakController {
  constructor(private readonly cpsamrakService: CpsamrakService) {}

  @Get()
  async getSeatCheck(): Promise<string> {
    return this.cpsamrakService.getSeatCheck();
  }
}
