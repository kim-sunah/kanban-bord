import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { InCharge } from './entities/in-charge.entity';
import { BoardColumn } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, InCharge,BoardColumn,User])],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
