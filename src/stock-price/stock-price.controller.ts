import { Controller, Param, Put } from '@nestjs/common';
import { StockPriceService } from './stock-price.service';

@Controller('stock')
export class StockPriceController {
  constructor(private readonly stockPriceService: StockPriceService) {}

  @Put('/:symbol')
  public async startWatchingStock(@Param('symbol') symbol: string): Promise<void> {
    return this.stockPriceService.startWatchingStock(symbol);
  }
}
