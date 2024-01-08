/* eslint-disable prettier/prettier */
import {
  BeforeInsert,
  BeforeRemove,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// import { Bord } from '../../bord/entities/bord.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'bordcolumn',
})
export class BordColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  //   @BeforeInsert()
  //   async generateOrder() {
  //     const maxOrder = await BordColumn.findOne(
  //       { order: { $gt: 0 } },
  //       { order: 'order', select: ['order'] },
  //     );
  //     this.order = maxOrder ? maxOrder.order + 1 : 1;
  //   }

  //   @BeforeRemove()
  //   async shiftOrderOnRemove() {
  //     await BordColumn.createQueryBuilder()
  //       .update(BordColumn)
  //       .set({ order: () => '"order" - 1' })
  //       .where('"order" > :order', { order: this.order })
  //       .execute();
  //   }

  @ManyToOne(() => Bord, (bord) => bord.columns, {
    onDelete: 'CASCADE',
  })
  bord: Bord;

  @Column({ type: 'bigint', name: 'bord_id' })
  bord_id: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number;
}

export class Bord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number;
}
