import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BordColumn, Bord } from './entities/column.entity';
import { MoveColumnDto, PostColumnDto } from './dto/column.dto';

@Injectable()
export class BordColumnService {
  constructor(
    @InjectRepository(BordColumn)
    private bordcolumnRepository: Repository<BordColumn>,
    @InjectRepository(Bord)
    private bordRepository: Repository<Bord>,
  ) {}

  async getcolumn(bordId: number) {
    const columns = await this.bordcolumnRepository.find({
      where: { bord_id: bordId },
    });
    return columns;
  }

  async postcolumn(
    bordid: number,
    userId: number,
    postColumnDto: PostColumnDto,
  ) {
    const maxOrderColumn = await this.bordcolumnRepository.findOne({
      where: { bord_id: bordid },
      order: { order: 'DESC' },
    });

    const order = maxOrderColumn ? maxOrderColumn.order + 1 : 1;

    const bordColumn = this.bordcolumnRepository.create({
      name: postColumnDto.name,
      order: order,
      bord_id: bordid,
      user_id: userId,
    });

    await this.bordcolumnRepository.save(bordColumn);
    return bordColumn;
  }

  async putcolumn(user: User, columnid: number, postColumnDto: PostColumnDto) {
    const column = await this.bordcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }
    const bordid = column.bord_id;
    const userid = user.id;

    await this.checkBord(bordid, userid);

    column.name = postColumnDto.name;

    await this.bordcolumnRepository.save(column);
    return column;
  }

  async movecolumn(
    userid: number,
    columnid: number,
    moveColumnDto: MoveColumnDto,
  ) {
    const column = await this.bordcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }

    const currentOrder = column.order;
    const bordid = column.bord_id;
    const newOrder = moveColumnDto.order;

    await this.checkBord(bordid, userid);

    await this.moveorder(column, currentOrder, newOrder);

    column.order = newOrder;
    await this.bordcolumnRepository.save(column);
  }

  async deleteColumn(user: User, columnid: number) {
    const column = await this.bordcolumnRepository.findOne({
      where: { id: columnid },
    });

    if (!column) {
      throw new NotFoundException(`컬럼이 없습니다.`);
    }
    const bordid = column.bord_id;
    const userid = user.id;
    const currentOrder = column.order;

    await this.checkBord(bordid, userid);

    await this.bordcolumnRepository
      .createQueryBuilder()
      .update(BordColumn)
      .set({ order: () => '"order" - 1' })
      .where('"order" > :currentOrder AND "bord_id" = :bordId', {
        currentOrder,
        bordId: bordid,
      })
      .execute();

    await this.bordcolumnRepository.delete(columnid);
  }

  private async checkBord(bordid: number, userid: number) {
    const bord = await this.bordRepository.findOne({
      where: { user_id: userid },
    });

    if (!bord || bord.id !== bordid) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
  }

  private async moveorder(
    column: BordColumn,
    currentOrder: number,
    newOrder: number,
  ) {
    if (column.order !== newOrder) {
      if (currentOrder < newOrder) {
        await this.bordcolumnRepository
          .createQueryBuilder()
          .update(BordColumn)
          .set({ order: () => '"order" - 1' })
          .where(
            '"order" > :currentOrder AND "order" <= :newOrder AND "bord_id" = :bordId',
            {
              currentOrder,
              newOrder,
              bordId: column.bord_id,
            },
          )
          .execute();
      } else {
        await this.bordcolumnRepository
          .createQueryBuilder()
          .update(BordColumn)
          .set({ order: () => '"order" + 1' })
          .where(
            '"order" < :currentOrder AND "order" >= :newOrder AND "bord_id" = :bordId',
            {
              currentOrder,
              newOrder,
              bordId: column.bord_id,
            },
          )
          .execute();
      }
    }
  }
}
