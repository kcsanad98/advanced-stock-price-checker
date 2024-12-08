import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPriceModule } from './stock-price/stock-price.module';
import { StockPrice } from './stock-price/stock-price.entity';
import { Stock } from './stock-price/stock.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: parseInt(configService.getOrThrow('POSTGRES_PORT')),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        entities: [Stock, StockPrice],
        ssl: false,
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    StockPriceModule
  ]
})
export class AppModule {}
