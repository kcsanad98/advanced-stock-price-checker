import { Module } from '@nestjs/common';
import { FinnhubClientService } from './finnhub-client.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FinnhubClientService],
  exports: [FinnhubClientService]
})
export class FinnhubClientModule {}
