import { BordColumnService } from './column.service';
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

import { UserInfo } from '../utils/userInfo.decorator';
import { MoveColumnDto, PostColumnDto } from './dto/column.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('column')
export class BordColumnController {
  constructor(private readonly bordcolumnService: BordColumnService) {}

  @Get(':bordid')
  async getcolumn(@Param('bordid') bordId: number) {
    return await this.bordcolumnService.getcolumn(bordId);
  }

  @Post(':bordid')
  async postcolumn(
    @UserInfo() user: User,
    @Param('bordid') bordid: number,
    @Body() postColumnDto: PostColumnDto,
  ) {
    await this.bordcolumnService.postcolumn(bordid, user.id, postColumnDto);
  }

  //관리자 롤이 있으면 관리자가 수정
  //팀으로 인바이트시 수정밑 삭제
  @Patch('put/:columnid')
  async putcolumn(
    @UserInfo() user: User
    @Param('columnid') columnid: number,
    @Body() postColumnDto: PostColumnDto,
  ) {
    await this.bordcolumnService.putcolumn(user,columnid, postColumnDto);
  }

  @Patch('move/:columnid')
  async movecolumn(
    @UserInfo() user: User,
    @Param('columnid') columnid: number,
    @Body() moveColumnDto: MoveColumnDto,
  ) {
    const userid = user.id;
    await this.bordcolumnService.movecolumn(userid, columnid, moveColumnDto);
  }

  //롤가드로 같은 팀일때만
  @Delete(':columnid')
  async deleteColumn(@UserInfo() user: User,,@Param('columnid') columnid: number) {
    await this.bordcolumnService.deleteColumn(user,columnid);
  }
}
