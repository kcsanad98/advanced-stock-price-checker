import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interval } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { StockPrice } from './stock-price.entity';
import { FinnhubClientService } from '../finnhub-client/finnhub-client.service';

const EVERY_MINUTE = 60 * 1000;

@Injectable()
export class StockPriceAggregationService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(StockPrice)
    private readonly stockPriceRepository: Repository<StockPrice>,
    private readonly finnhubClientService: FinnhubClientService
  ) {}

  @Interval(EVERY_MINUTE)
  public async updateAverageStockPrices(): Promise<void> {
    const watchedStocks = await this.stockRepository.find();

    const stockPrices = (
      await Promise.all(
        watchedStocks.map(async (stock: Stock) => {
          try {
            const currentPrice = await this.finnhubClientService.getCurrentStockPrice(stock.symbol);
            return this.stockPriceRepository.create({ price: currentPrice, stock });
          } catch (error: unknown) {
            Logger.error(`Failed to fetch price for stock with symbol ${stock.symbol}.`, error);
          }
        })
      )
    ).filter(stockPrice => stockPrice);
    await this.stockPriceRepository.save(stockPrices);

    const averages = await this.stockPriceRepository
      .createQueryBuilder('stock_price')
      .select('stock_price.stock_symbol', 'symbol')
      .addSelect('AVG(stock_price.price)', 'averagePrice')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('id')
          .from(StockPrice, 'sp')
          .where('sp.stock_symbol = stock_price.stock_symbol')
          .orderBy('sp.created_at', 'DESC')
          .limit(10)
          .getQuery();
        return `stock_price.id IN ${subQuery}`;
      })
      .groupBy('stock_price.stock_symbol')
      .getRawMany();

    await Promise.all(
      averages.map(async average => {
        await this.stockRepository.update(
          { symbol: average.symbol },
          { average_price: parseFloat(average.averagePrice) }
        );
        Logger.log(
          `Successfully updated average price of stock ${average.symbol} to ${average.averagePrice}`
        );
      })
    );
  }
}
