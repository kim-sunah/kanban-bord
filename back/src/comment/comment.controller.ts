import {
  Body,
  Param,
  Req,
  Get,
  Post,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { Id } from '../utils/id';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
@UseGuards(AuthGuard('jwt')) // 해당 보드에 있는 사람만 만들게 해야 될듯?
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 쓰기
  @Post(':id')
  async createComment(
    @Body() commentDto: CommentDto,
    @Param() params: Id,
    @Req() req,
  ) {
    await this.commentService.createComment(
      commentDto.body,
      req.user.userSeq,
      params.id,
    );
    return { message: '댓글이 등록되었습니다.' };
  }

  // 특정 카드의 댓글 목록 보기
  @Get(':id')
  async getCommentsByCard(@Param() params: Id) {
    return await this.commentService.getCommentsByCard(params.id);
  }

  // 댓글 삭제
  @Delete(':id')
  @HttpCode(204)
  async deleteComment(@Param() params: Id, @Req() req) {
    await this.commentService.deleteComment(req.user.userSeq, params.id);
  }
}
