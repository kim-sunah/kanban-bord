import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { Boarduser } from './entities/boadr_user.entity';
import _ from "lodash"

@Injectable()
export class BoardService {
  constructor(@InjectRepository(Board) private boardRepository : Repository<Board>, @InjectRepository(Boarduser) private boarduserRepository : Repository<Boarduser>){}
  create(createBoardDto: CreateBoardDto) {
    if(!createBoardDto.name || !createBoardDto.description || !createBoardDto.color){
      throw new BadRequestException("모든 칸에 입력해주시기 바랍니다")
    }
    return this.boardRepository.save(createBoardDto);
  }

  inviteUser(id: number) {
    return `This action returns a #${id} board`;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardRepository.findOne({where : {userId : 1 }}) //추후 수정 
    if(_.isNil(board)){
      throw new UnauthorizedException("수정할 권한이 없습니다.")
    }

    return await this.boardRepository.update(board, updateBoardDto)
  }

  async remove(id: number) {
    const board = await this.boardRepository.findOne({where : {userId : 1 }}) //추후 수정 
    if(_.isNil(board)){
      throw new UnauthorizedException("삭제할 권한이 없습니다.")
    }
   
    return await this.boardRepository.remove(board)
  }
}
