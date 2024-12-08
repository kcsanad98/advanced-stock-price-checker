import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { StockPrice } from './stock-price.entity';

@Entity('stock')
export class Stock extends BaseEntity {
  @PrimaryColumn()
  symbol: string;

  @Column()
  average_price: number;

  @Column()
  updated_at: number;

  @OneToMany(() => StockPrice, stockPrice => stockPrice.stock)
  prices: StockPrice[];
}
