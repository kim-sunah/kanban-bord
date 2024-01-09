import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { Boarduser } from './entities/boadr_user.entity';
import _ from "lodash"
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(@InjectRepository(Board) private boardRepository : Repository<Board>, @InjectRepository(Boarduser) private boarduserRepository : Repository<Boarduser>, @InjectRepository(User) private userRepository : Repository<User>){}
  async create(createBoardDto: CreateBoardDto, user : User) {
    if(!createBoardDto.name || !createBoardDto.description || !createBoardDto.color){
      throw new BadRequestException("모든 칸에 입력해주시기 바랍니다")
    }
    createBoardDto.userId = +user.userSeq;
    return await this.boardRepository.save(createBoardDto)

  }

  async find(user : User){
    
   const board = await this.boardRepository.find({where : {userId : user.userSeq}})
   return {statusCode : 200 , board}
 

  }

  async inviteUser(id: number, email : string) {
   const user = await this.userRepository.findOne({where : {email : email}})
  
   if(_.isNil(user)){
      throw new NotFoundException("유저를 찾을수 없습니다.")
   }
   const boarduser = await this.boarduserRepository.find({where : {userId : user.userSeq}})
   if(boarduser){
    throw new BadRequestException("이미 초대된 유저입니다")
   }

   const board = await this.boardRepository.findOne({where : {id : id}})
   if(_.isNil(board)){
    throw new NotFoundException("보드를 찾을수 없습니다.")
  }
   
  const boardUser = this.boarduserRepository.create();  // BoardUser 엔터티는 보드와 유저 간의 매핑 역할을 하는 엔터티입니다.
  boardUser.borderId = +board.id;
  boardUser.userId = +user.userSeq;

  await this.boarduserRepository.save(boardUser);
  return {statusCode : 200}

  }

  async update(id: number, updateBoardDto: UpdateBoardDto , user : User) {
    const board = await this.boardRepository.findOne({where : {userId : +user.userSeq , id : id }}) //추후 수정 
    const boarduser = await this. boarduserRepository.findOne({where :{userId : +user.userSeq}})
    if(_.isNil(board)){
      throw new UnauthorizedException("수정할 권한이 없습니다.")
    }

    return await this.boardRepository.update(board, updateBoardDto)
  }

  async remove(id: number, user : User) {
    const board = await this.boardRepository.findOne({where : {userId :  +user.userSeq , id : id}}) //추후 수정 
    if(_.isNil(board)){
      throw new UnauthorizedException("삭제할 권한이 없습니다.")
    }
   
    return await this.boardRepository.remove(board)
  }
}
