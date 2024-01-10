import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
	@InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  
  // 유저 이름 불러오기
  async getName(userSeq: number){
	const user = await this.userRepository.findOne({where:{userSeq}})
	return user? user.name:'<탈퇴한 사용자>'
  }

  // 댓글 쓰기
  async createComment(body: string, userSeq: number, cardSeq: number) {
    try {
      return await this.commentRepository.save({ cardSeq, userSeq, body });
    } catch (e) {
      if (e instanceof QueryFailedError)
        throw new NotFoundException('해당 카드가 존재하지 않습니다.');
      throw e;
    }
  }

  // 특정 카드의 댓글 목록 보기
  async getCommentsByCard(cardSeq: number) {
    const comments = await this.commentRepository.find({ where: { cardSeq } });
	return await Promise.all(comments.map(async comment => {return {...comment,name:await this.getName(comment.userSeq)}}))
  }

  // 댓글 삭제
  async deleteComment(userSeq: number, commentSeq: number) {
    const comment = await this.commentRepository.findOne({
      where: { commentSeq },
    });
    if (!comment) throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    if (userSeq !== comment.userSeq)
      throw new ForbiddenException('권한이 없습니다.');
    await this.commentRepository.delete({ commentSeq });
  }
}
