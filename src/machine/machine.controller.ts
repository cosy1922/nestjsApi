import { Controller, Get } from '@nestjs/common';
import { MachineService } from './machine.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('machine')
@ApiTags('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Get()
  getTest(): string {
    return this.machineService.getTest();
  }

  @Get('/test')
  pushTest(): string {
    return this.machineService.getPush();
  }

  @Get('/test2')
  pushTest2(): string {
    return this.machineService.getPush2();
  }
}
