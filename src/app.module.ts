import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MachineModule } from './machine/machine.module';
import { TcModule } from './tc/tc.module';
import { FcmModule } from './fcm/fcm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpsamrakModule } from './cpsamrak/cpsamrak.module';
import { DaejeoModule } from './daejeo/daejeo.module';

@Module({
  imports: [
    MachineModule,
    TcModule,
    FcmModule,
    CpsamrakModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'delbert-mysql.c8r93cfrqs4z.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'root',
      password: 'gksrkd12',
      database: 'meet',
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
    }),
    DaejeoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
