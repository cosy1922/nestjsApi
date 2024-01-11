import { Module } from '@nestjs/common';
import { DaejeoService } from './daejeo.service';
import { DaejeoController } from './daejeo.controller';
import { FcmService } from 'src/fcm/fcm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tb_mobile_token } from 'src/fcm/fcm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([tb_mobile_token])],
  controllers: [DaejeoController],
  providers: [DaejeoService, FcmService],
})
export class DaejeoModule {}
