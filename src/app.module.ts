import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GoogleSheetsService } from './google-sheets.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [GoogleSheetsService],
})
export class AppModule {}
