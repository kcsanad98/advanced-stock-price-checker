import { Module } from '@nestjs/common';
import { StockPriceService } from './stock-price.service';
import { StockPriceController } from './stock-price.controller';
import { FinnhubClientModule } from 'src/finnhub-client/finnhub-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { StockPrice } from './stock-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, StockPrice]), FinnhubClientModule],
  providers: [StockPriceService],
  controllers: [StockPriceController]
})
export class StockPriceModule {}
