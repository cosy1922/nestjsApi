import { Module } from '@nestjs/common';
import { CpsamrakService } from './cpsamrak.service';
import { CpsamrakController } from './cpsamrak.controller';

@Module({
  // imports: [HttpModule, TypeOrmModule.forFeature([])],
  controllers: [CpsamrakController],
  providers: [CpsamrakService],
})
export class CpsamrakModule {}
