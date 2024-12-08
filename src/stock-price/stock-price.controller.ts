import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  UseInterceptors
} from '@nestjs/common';
import { StockPriceService } from './stock-price.service';
import { Stock } from './stock.entity';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stock')
@UseInterceptors(ClassSerializerInterceptor)
export class StockPriceController {
  constructor(private readonly stockPriceService: StockPriceService) {}

  @Put('/:symbol')
  @ApiOperation({
    summary:
      'Initiate watching a stock by its symbol. The application queries the prices of the stocks being watched every minute.'
  })
  @ApiOkResponse({ type: Stock })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Returned when attempting to initiate watching a stock that is already being watched.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Returned when no stock is available for the provided symbol.'
  })
  public async startWatchingStock(@Param('symbol') symbol: string): Promise<Stock> {
    return this.stockPriceService.startWatchingStock(symbol);
  }

  @Get('/:symbol')
  @ApiOperation({
    summary:
      'Get the average price of a stock being watched. The average price is calculated for the 10 last prices available for a stock.'
  })
  @ApiOkResponse({ type: Stock })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Returned when no stock is being watched for the provided symbol.'
  })
  public async getAverageStockPrice(@Param('symbol') symbol: string): Promise<Stock> {
    return this.stockPriceService.getAverageStockPrice(symbol);
  }
}
