import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('board')

@UseGuards(AuthGuard("jwt"))

export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @UserInfo() user : User) {
    return this.boardService.create(createBoardDto,user)
  }
  @Get()
  async find(@UserInfo() user : User){
    return  await this.boardService.find(user)
  }
  @Get(":id")
  inviteusersearch(@Param('id') boardId: string){
    console.log(boardId)
    return this.boardService.inviteusersearch(+boardId)

  }

  @Post(':boardId/invite')
  inviteUser(@Param('boardId') boardId: string,@Body('email') email : string) {
    return this.boardService.inviteUser(+boardId, email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto,  @UserInfo() user : User) {
    return this.boardService.update(+id, updateBoardDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,  @UserInfo() user : User) {
    return this.boardService.remove(+id, user );
  }
}
