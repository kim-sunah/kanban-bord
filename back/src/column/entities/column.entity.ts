/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { User } from '../../user/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

@Entity({
  name: 'boardcolumn',
})
export class BoardColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => Board, (board) => board.columns, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Column({ type: 'bigint', name: 'board_id' })
  board_id: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number;
  
  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
