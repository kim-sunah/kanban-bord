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
import { Repository } from 'typeorm';
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

    await this.moveorder(column, currentOrder, newOrder);

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

    await this.checkboard(boardid, userid);

    await this.boardcolumnRepository
      .createQueryBuilder()
      .update(BoardColumn)
      .set({ order: () => '"order" - 1' })
      .where('"order" > :currentOrder AND "board_id" = :boardId', {
        currentOrder,
        boardId: boardid,
      })
      .execute();

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

  private async moveorder(
    column: BoardColumn,
    currentOrder: number,
    newOrder: number,
  ) {
    if (column.order !== newOrder) {
      if (currentOrder < newOrder) {
        await this.boardcolumnRepository
          .createQueryBuilder()
          .update(BoardColumn)
          .set({ order: () => '"order" - 1' })
          .where(
            '"order" > :currentOrder AND "order" <= :newOrder AND "board_id" = :boardId',
            {
              currentOrder,
              newOrder,
              boardId: column.board_id,
            },
          )
          .execute();
      } else {
        await this.boardcolumnRepository
          .createQueryBuilder()
          .update(BoardColumn)
          .set({ order: () => '"order" + 1' })
          .where(
            '"order" < :currentOrder AND "order" >= :newOrder AND "board_id" = :boardId',
            {
              currentOrder,
              newOrder,
              boardId: column.board_id,
            },
          )
          .execute();
      }
    }
  }
}
