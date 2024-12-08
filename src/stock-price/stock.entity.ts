import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { StockPrice } from './stock-price.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'stock' })
export class Stock extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty({ example: 'AAPL', description: 'Symbol of the stock.' })
  @Index()
  symbol: string;

  @Column({ type: 'float' })
  @ApiProperty({
    example: 252.45,
    description: 'Average price in USD of the last 10 known prices of the stock.'
  })
  average_price: number;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The timestamp of the last update of the average price.' })
  updated_at: Date;

  @OneToMany(() => StockPrice, stockPrice => stockPrice.stock)
  @Exclude()
  prices: StockPrice[];
}
