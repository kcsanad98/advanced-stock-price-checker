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
@Index(['created_at', 'stock_symbol'])
export class StockPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Stock, stock => stock.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_symbol' })
  stock: Stock;

  @Column()
  stock_symbol: string;
}
