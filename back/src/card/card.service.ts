import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { InCharge } from './entities/in-charge.entity';
import { DataSource, Repository } from 'typeorm';
import { CardDto, UpdateCardDto } from './dto/card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(InCharge)
    private readonly inChargeRepository: Repository<InCharge>,
    private readonly dataSource: DataSource,
  ) {}

  // 특정 컬럼의 카드 목록 보기
  async getCardsByColumn(columnSeq: number) {
    return await this.cardRepository.find({ where: { columnSeq } });
  }

  // 특정 컬럼에 있는 카드의 포지션 중 최대값 찾기
  async maxPosition(columnSeq: number) {
    let { position } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.position)', 'position')
      .where('card.columnSeq = :id', { id: columnSeq })
      .getRawOne();
    return position || 0;
  }

  // 카드 만들기
  async createCard(cardDto: CardDto, columnSeq: number) {
    const position = (await this.maxPosition(columnSeq)) + 1;
    await this.cardRepository.insert({ ...cardDto, position, columnSeq });
  }

  // 특정 카드 찾기
  async findCard(cardSeq: number) {
    return await this.cardRepository.findOne({ where: { cardSeq } });
  }

  // 카드 정보 수정
  async updateCard(updateCardDto: UpdateCardDto, cardSeq: number) {
    await this.cardRepository.update({ cardSeq }, updateCardDto);
    const card = await this.findCard(cardSeq);
    if (!card) throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    return card;
  }

  // 컬럼에서 카드 한칸 위로 올리기
  async cardUp(cardSeq: number) {
    const card = await this.findCard(cardSeq);
    if (!card) throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    const { position, columnSeq } = card;
    console.log(columnSeq, position);
    const { prevPosition } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.position)', 'prevPosition')
      .where('card.columnSeq = :id', { id: columnSeq })
      .andWhere('card.position < :pos', { pos: position })
      .getRawOne();
    if (!prevPosition)
      throw new BadRequestException('카드가 이미 맨 위에 있습니다.');
    // 카드 포지션 바꾸는 트랜잭션
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      card.position = -1;
      await queryRunner.manager.save(card);
      await queryRunner.manager.update(
        Card,
        { columnSeq, position: prevPosition },
        { position },
      );
      card.position = prevPosition;
      await queryRunner.manager.save(card);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // 컬럼에서 카드 한칸 아래로 내리기
  async cardDown(cardSeq: number) {
    const card = await this.findCard(cardSeq);
    if (!card) throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    const { position, columnSeq } = card;
    console.log(columnSeq, position);
    const { nextPosition } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MIN(card.position)', 'nextPosition')
      .where('card.columnSeq = :id', { id: columnSeq })
      .andWhere('card.position > :pos', { pos: position })
      .getRawOne();
    if (!nextPosition)
      throw new BadRequestException('카드가 이미 맨 아래에 있습니다.');
    // 카드 포지션 바꾸는 트랜잭션
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      card.position = -1;
      await queryRunner.manager.save(card);
      await queryRunner.manager.update(
        Card,
        { columnSeq, position: nextPosition },
        { position },
      );
      card.position = nextPosition;
      await queryRunner.manager.save(card);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // 카드 다른 컬럼으로 이동
  async moveCard(cardSeq: number, columnSeq: number) {
    const card = await this.findCard(cardSeq);
    if (!card) throw new NotFoundException('해당 카드를 찾을 수 없습니다.');
    if (columnSeq === card.columnSeq)
      throw new BadRequestException('카드가 이미 해당 컬럼에 있습니다.');
    const position = (await this.maxPosition(columnSeq)) + 1;
    await this.cardRepository.update({ cardSeq }, { position, columnSeq });
  }

  // 카드 삭제
  async deleteCard(cardSeq: number) {
    await this.cardRepository.delete(cardSeq);
  }
}
