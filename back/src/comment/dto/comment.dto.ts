import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  body: string;
}
