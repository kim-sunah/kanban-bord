import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {Card} from './entities/card.entity'
import {InCharge} from './entities/in-charge.entity'
import { Repository } from 'typeorm'
import {CardDto, UpdateCardDto} from './dto/card.dto'

@Injectable()
export class CardService {
	constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
        @InjectRepository(InCharge)
        private readonly inChargeRepository: Repository<InCharge>
    ) {}
	
	// 카드 만들기
	async createCard(cardDto: CardDto, columnSeq: number){
		// 컬럼에서 position 가져오는거 추가
		await this.cardRepository.insert({...cardDto,position:1,columnSeq})
	}
	
	// 특정 컬럼의 카드 목록 보기
	async getCardsByColumn(columnSeq: number){
		return await this.cardRepository.find({where:{columnSeq}})
	}
	
	// 특정 카드 찾기
	async findCard(cardSeq: number){
		return await this.cardRepository.findOne({where:{cardSeq}})
	}
	
	// 카드 정보 수정
	async updateCard(updateCardDto: UpdateCardDto, cardSeq: number){
		await this.cardRepository.update({cardSeq},updateCardDto)
		const card = await this.findCard(cardSeq)
		if(!card) throw new NotFoundException('해당 카드를 찾을 수 없습니다.')
		return card
	}
	
	// 카드 삭제
	// 뒷 position 하나씩 당겨오는 거 추가
	async deleteCard(cardSeq: number){
		await this.cardRepository.delete(cardSeq)
	}
}
