import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stock } from './stock.entity';

@Entity('stock-price')
export class StockPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  price: number;

  @ManyToOne(() => Stock, stock => stock.prices, { onDelete: 'CASCADE' })
  stock: Stock;
}
