import { BoardColumnService } from './column.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { MoveColumnDto, PostColumnDto } from './dto/column.dto';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('column')
export class BoardColumnController {
  constructor(private readonly boardcolumnService: BoardColumnService) {}

  @Get(':boardid')
  async getcolumn(@Param('boardid') boardid: number) {
    return await this.boardcolumnService.getcolumn(boardid);
  }

  @Post(':boardid')
  async postcolumn(
    @UserInfo() user: User,
    @Param('boardid') boardid: number,
    @Body() postColumnDto: PostColumnDto,
  ) {
    await this.boardcolumnService.postcolumn(
      boardid,
      user.userSeq,
      postColumnDto,
    );
  }

  @Patch('put/:columnid')
  async putcolumn(
    @UserInfo() user: User,
    @Param('columnid') columnid: number,
    @Body() postColumnDto: PostColumnDto,
  ) {
    await this.boardcolumnService.putcolumn(user, columnid, postColumnDto);
  }

  @Patch('move/:columnid')
  async movecolumn(
    @UserInfo() user: User,
    @Param('columnid') columnid: number,
    @Body() moveColumnDto: MoveColumnDto,
  ) {
    const userid = user.userSeq;
    await this.boardcolumnService.movecolumn(userid, columnid, moveColumnDto);
  }

  @Delete('delete/:columnid')
  async deleteColumn(
    @UserInfo() user: User,
    @Param('columnid') columnid: number,
  ) {
    await this.boardcolumnService.deleteColumn(user, columnid);
  }
}
