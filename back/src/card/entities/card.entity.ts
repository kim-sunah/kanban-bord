import {
  Column,
  Entity,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InCharge } from './in-charge.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { BoardColumn } from '../../column/entities/column.entity';

@Entity({ name: 'card' })
@Unique(['columnSeq', 'position'])
export class Card {
  @PrimaryGeneratedColumn()
  cardSeq: number;

  @Column('varchar', { length: 70 })
  name: string;

  @Column('text', { nullable: true })
  description!: string;

  // enum이 나을듯 하긴 한데
  @Column('varchar', { length: 50, nullable: true })
  color!: string;

  @ManyToOne(() => BoardColumn, column => column.cards, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'column_seq' })
  column: BoardColumn;
  
  @Column('int')
  columnSeq: number;

  @Column('int')
  position: number;

  @Column('datetime')
  deadline: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => InCharge, (inCharge) => inCharge.card)
  inCharges: InCharge[];

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}
