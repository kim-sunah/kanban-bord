import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostColumnDto {
  @IsString()
  @IsNotEmpty({ message: '타이틀을 입력해주세요.' })
  name: string;
}

export class MoveColumnDto {
  @IsNumber()
  @IsNotEmpty({ message: '순서를 입력해주세요.' })
  order: number;
}
