import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinnhubClientService } from '../finnhub-client/finnhub-client.service';
import { Stock } from './stock.entity';
import { StockPrice } from './stock-price.entity';

@Injectable()
export class StockPriceService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(StockPrice)
    private readonly stockPriceRepository: Repository<StockPrice>,
    private readonly finnhubClientService: FinnhubClientService
  ) {}

  public async startWatchingStock(symbol: string): Promise<void> {
    console.log(1);
    const isStockAlreadyWatched = !!(await this.stockRepository.findOneBy({ symbol }));
    if (isStockAlreadyWatched) {
      throw new ConflictException(`Stock with symbol ${symbol} is already being watched.`);
    }
    console.log(2);

    try {
      const quoteData = await this.finnhubClientService.getQuoteData(symbol);

      const stock = this.stockRepository.create({
        symbol,
        average_price: quoteData.c,
        updated_at: quoteData.t
      });
      const stockPrice = this.stockPriceRepository.create({ price: quoteData.c, stock });
      stock.prices.push(stockPrice);

      await this.stockRepository.save(stock);
    } catch (error) {
      console.log(error);
    }
  }
}
