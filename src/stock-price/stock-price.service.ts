import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
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

  public async getAverageStockPrice(symbol: string): Promise<Stock> {
    const stock = await this.getStock(symbol);
    if (!stock) {
      throw new NotFoundException(`Stock with symbol ${symbol} is not being watched.`);
    }

    return stock;
  }

  public async startWatchingStock(symbol: string): Promise<Stock> {
    const isStockAlreadyWatched = !!(await this.getStock(symbol));
    if (isStockAlreadyWatched) {
      throw new ConflictException(`Stock with symbol ${symbol} is already being watched.`);
    }

    try {
      const currentPrice = await this.finnhubClientService.getCurrentStockPrice(symbol);

      const stock = this.stockRepository.create({
        symbol,
        average_price: currentPrice,
        prices: []
      });
      const stockPrice = this.stockPriceRepository.create({ price: currentPrice, stock });
      stock.prices.push(stockPrice);

      return this.stockRepository.save(stock);
    } catch (error: unknown) {
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  private async getStock(symbol: string): Promise<Stock> {
    return this.stockRepository.findOneBy({ symbol });
  }
}
