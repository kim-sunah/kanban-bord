import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Boarduser } from './entities/boadr_user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Board,Boarduser])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
