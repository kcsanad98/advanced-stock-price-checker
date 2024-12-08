import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as finnhub from 'finnhub';
import { QuoteData } from './definitions';

@Injectable()
export class FinnhubClientService {
  constructor(private readonly configService: ConfigService) {
    const apiConfig = finnhub.ApiClient.instance.authentications.api_key;
    apiConfig.api_key = configService.getOrThrow('API_FINNHUB_API_KEY');
    this.finnhubClient = new finnhub.DefaultApi();
  }

  private readonly finnhubClient;

  public async getQuoteData(symbol: string): Promise<QuoteData> {
    return new Promise((resolve, reject) => {
      this.finnhubClient.quote(symbol, (error: unknown, data: QuoteData) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  }
}
