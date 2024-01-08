import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InCharge } from '../../card/entities/in-charge.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  userSeq: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => InCharge, (inCharge) => inCharge.user)
  inCharges: InCharge[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
