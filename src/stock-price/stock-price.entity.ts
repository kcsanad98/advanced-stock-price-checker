import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity({ name: 'stock-price' })
export class StockPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  @ManyToOne(() => Stock, stock => stock.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_symbol' })
  stock: Stock;
}
