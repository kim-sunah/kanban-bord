import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../../card/entities/card.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  commentSeq: number;

  @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_seq' })
  card: Card;

  @Column('int')
  cardSeq: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_seq' })
  user: User;

  @Column('int')
  userSeq: number;

  @Column('text')
  body: string;

  @CreateDateColumn()
  created_at: Date;
}
