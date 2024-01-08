import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entities/column.entity';
import { MoveColumnDto, PostColumnDto } from './dto/column.dto';
import { Board } from 'src/board/entities/board.entity';
import { User } from './../user/entities/user.entity';
import { Between, MoreThan, Repository } from 'typeorm';
@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(BoardColumn)
    private boardcolumnRepository: Repository<BoardColumn>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}
  async getcolumn(boardid: number) {
    const columns = await this.boardcolumnRepository.find({
      where: { board_id: boardid },
    });
    return columns;
  }

  async postcolumn(
    boardid: number,
    userId: number,
    postColumnDto: PostColumnDto,
  ) {
    const maxOrderColumn = await this.boardcolumnRepository.findOne({
      where: { board_id: boardid },
      order: { order: 'DESC' },
    });

    const order = maxOrderColumn ? maxOrderColumn.order + 1 : 1;

    const boardColumn = this.boardcolumnRepository.create({
      name: postColumnDto.name,
      order: order,
      board_id: boardid,
      user_id: userId,
    });

    await this.boardcolumnRepository.save(boardColumn);
    return boardColumn;
  }

  async putcolumn(user: User, columnid: number, postColumnDto: PostColumnDto) {
    const column = await this.boardcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }
    const boardid = column.board_id;
    const userid = user.userSeq;

    await this.checkboard(boardid, userid);

    column.name = postColumnDto.name;

    await this.boardcolumnRepository.save(column);
    return column;
  }

  async movecolumn(
    userid: number,
    columnid: number,
    moveColumnDto: MoveColumnDto,
  ) {
    const column = await this.boardcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }

    const currentOrder = column.order;
    const boardid = column.board_id;
    const newOrder = moveColumnDto.order;

    await this.checkboard(boardid, userid);
    await this.moveorder(currentOrder, newOrder, boardid);

    column.order = newOrder;
    await this.boardcolumnRepository.save(column);
  }

  async deleteColumn(user: User, columnid: number) {
    const column = await this.boardcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }
    const boardid = column.board_id;
    const userid = user.userSeq;
    const currentOrder = column.order;
    const maxOrder = await this.getMaxOrder(boardid);

    await this.checkboard(boardid, userid);
    await this.deleteorder(currentOrder, maxOrder, boardid);
    await this.boardcolumnRepository.delete(columnid);
  }

  private async checkboard(boardid: number, userid: number) {
    const board = await this.boardRepository.findOne({
      where: { userId: userid },
    });

    if (!board || board.id !== boardid) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
  }

  private async getMaxOrder(boardid) {
    const maxOrderColumn = await this.boardcolumnRepository.findOne({
      where: { board_id: boardid },
      order: { order: 'DESC' },
    });

    return maxOrderColumn.order;
  }

  private async moveorder(
    currentOrder: number,
    newOrder: number,
    boardid: number,
  ) {
    try {
      if (currentOrder > newOrder) {
        const columnsToIncrease = await this.boardcolumnRepository.find({
          where: {
            board_id: boardid,
            order: Between(newOrder, currentOrder - 1),
          },
        });

        for (const col of columnsToIncrease) {
          col.order += 1;
          await this.boardcolumnRepository.save(col);
        }
      } else if (currentOrder < newOrder) {
        const columnsToDecrease = await this.boardcolumnRepository.find({
          where: {
            board_id: boardid,
            order: Between(currentOrder + 1, newOrder),
          },
        });

        for (const col of columnsToDecrease) {
          col.order -= 1;
          await this.boardcolumnRepository.save(col);
        }
      }
    } catch (error) {
      throw new NotFoundException('오류 발생');
    }
  }

  private async deleteorder(
    currentOrder: number,
    maxOrder: number,
    boardid: number,
  ) {
    try {
      if (currentOrder < maxOrder) {
        const columnsToUpdate = await this.boardcolumnRepository.find({
          where: {
            board_id: boardid,
            order: MoreThan(currentOrder),
          },
        });

        for (const col of columnsToUpdate) {
          col.order -= 1;
          await this.boardcolumnRepository.save(col);
        }
      }
    } catch (error) {
      throw new NotFoundException('삭제 중 오류 발생');
    }
  }
}
