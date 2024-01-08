import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumnService } from './column.service';
import { BoardColumnController } from './column.controller';
import { BoardColumn } from './entities/column.entity';
import { Board } from 'src/board/entities/board.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([BoardColumn]),
    TypeOrmModule.forFeature([Board]),
  ],
  providers: [BoardColumnService],
  controllers: [BoardColumnController],
})
export class BoardColumnModule {}
