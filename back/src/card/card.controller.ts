import {
  Body,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto, UpdateCardDto } from './dto/card.dto';
import { Id } from '../utils/id';
import { AuthGuard } from '@nestjs/passport';

// 컬럼 추가
@Controller('card')
@UseGuards(AuthGuard('jwt')) // 해당 보드에 있는 사람만 만들게 해야 될듯?
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // 카드 만들기
  @Post('column/:id')
  async createCard(@Body() cardDto: CardDto, @Param() params: Id) {
    await this.cardService.createCard(cardDto, params.id);
    return { message: '카드가 등록되었습니다.' };
  }

  // 특정 컬럼의 카드 목록 보기
  @Get('column/:id')
  async getCardsByColumn(@Param() params: Id) {
    return await this.cardService.getCardsByColumn(params.id);
  }

  // 카드 정보 수정
  @Patch(':id')
  async updateCard(@Body() updateCardDto: UpdateCardDto, @Param() params: Id) {
    const card = await this.cardService.updateCard(updateCardDto, params.id);
    return { message: '카드가 수정되었습니다.', card };
  }

  // 컬럼에서 카드 한칸 위로 올리기
  @Patch(':id/up')
  async cardUp(@Param() params: Id) {
    await this.cardService.cardUp(params.id);
    return { message: '카드를 위로 한 칸 올렸습니다.' };
  }

  // 컬럼에서 카드 한칸 아래로 내리기
  @Patch(':id/down')
  async cardDown(@Param() params: Id) {
    await this.cardService.cardDown(params.id);
    return { message: '카드를 아래로 한 칸 내렸습니다.' };
  }

  // 카드 다른 컬럼으로 이동
  @Patch(':id/:columnSeq')
  async moveCard(@Param() params: Id) {
    await this.cardService.moveCard(params.id, params.columnSeq);
    return { message: '카드를 다른 컬럼으로 이동했습니다.' };
  }

  // 카드 삭제
  @Delete(':id')
  @HttpCode(204)
  async deleteCard(@Param() params: Id) {
    await this.cardService.deleteCard(params.id);
  }
}
