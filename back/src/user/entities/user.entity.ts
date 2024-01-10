import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InCharge } from '../../card/entities/in-charge.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { BoardColumn } from 'src/column/entities/column.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  userSeq: number;

  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다.' })
  @Column({ unique: true })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 알파벳 대/소문자, 숫자, 특수문자를 포함해야합니다.',
    },
  )
  @Column()
  password: string;

  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @IsString({ message: '이름 형식에 맞지 않습니다.' })
  @Column()
  name: string;

  @OneToMany(() => InCharge, (inCharge) => inCharge.user)
  inCharges: InCharge[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];
}
