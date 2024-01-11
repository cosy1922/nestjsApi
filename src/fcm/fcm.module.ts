import { Module } from '@nestjs/common';
import { FcmController } from './fcm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { fcm } from './fcm.entity';
import { FcmService } from './fcm.service';
import { tb_mobile_token } from './fcm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([tb_mobile_token])],
  controllers: [FcmController],
  providers: [FcmService],
})
export class FcmModule {}
