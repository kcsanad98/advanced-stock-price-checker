import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockPriceService } from '../src/stock-price/stock-price.service';
import { Stock } from '../src/stock-price/stock.entity';
import { StockPrice } from '../src/stock-price/stock-price.entity';
import { FinnhubClientService } from '../src/finnhub-client/finnhub-client.service';

const stock = {
  symbol: 'AAPL',
  average_price: 252.45,
  updated_at: new Date(),
  prices: []
} as Stock;

describe('StockPriceService', () => {
  let service: StockPriceService;
  let finnhubClientService: FinnhubClientService;
  let stockRepository: Repository<Stock>;
  let stockPriceRepository: Repository<StockPrice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockPriceService,
        {
          provide: getRepositoryToken(Stock),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(stock),
            create: jest.fn().mockImplementation(stock => stock),
            save: jest.fn().mockImplementation(stock => stock)
          }
        },
        {
          provide: getRepositoryToken(StockPrice),
          useValue: {
            create: jest.fn().mockImplementation(stockPrice => stockPrice)
          }
        },
        {
          provide: FinnhubClientService,
          useValue: {
            getCurrentStockPrice: jest.fn().mockResolvedValue(123.45)
          }
        }
      ]
    }).compile();

    service = module.get(StockPriceService);
    finnhubClientService = module.get(FinnhubClientService);
    stockRepository = module.get(getRepositoryToken(Stock));
    stockPriceRepository = module.get(getRepositoryToken(StockPrice));
  });

  describe('getAverageStockPrice', () => {
    it('Should throw a NotFoundException if the stock was not found', async () => {
      jest.spyOn(stockRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.getAverageStockPrice('unknown')).rejects.toThrow(NotFoundException);
    });

    it('Should return the stock if it was found', async () => {
      const actual = await service.getAverageStockPrice(stock.symbol);

      expect(actual).toEqual(stock);
    });
  });

  describe('startWatchingStock', () => {
    it('Should throw a ConflictException if the stock is already watched', async () => {
      await expect(service.startWatchingStock(stock.symbol)).rejects.toThrow(ConflictException);
    });

    it('Should throw a NotFoundException if no stock exists for the provided symbol', async () => {
      jest.spyOn(stockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(finnhubClientService, 'getCurrentStockPrice').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(service.startWatchingStock(stock.symbol)).rejects.toThrow(NotFoundException);
    });

    it('Should create a Stock and a StockPrice entity if the stock price was fetched successfully', async () => {
      jest.spyOn(stockRepository, 'findOneBy').mockResolvedValueOnce(null);
      const stockCreateSpy = jest.spyOn(stockRepository, 'create');
      const stockSaveSpy = jest.spyOn(stockRepository, 'save');
      const stockPriceCreateSpy = jest.spyOn(stockPriceRepository, 'create');
      const expected = {
        average_price: 123.45,
        symbol: stock.symbol,
        prices: [
          {
            price: 123.45,
            stock: null
          }
        ]
      };
      expected.prices[0].stock = expected;

      const actual = await service.startWatchingStock(stock.symbol);

      expect(actual).toEqual(expected);
      expect(stockCreateSpy).toHaveBeenCalledTimes(1);
      expect(stockPriceCreateSpy).toHaveBeenCalledTimes(1);
      expect(stockSaveSpy).toHaveBeenCalledTimes(1);
      expect(stockSaveSpy).toHaveBeenCalledWith(expected);
    });
  });
});
