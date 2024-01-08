import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BordColumnService } from './column.service';
import { BordColumnController } from './column.controller';
import { BordColumn } from './entities/column.entity';
@Module({
  imports: [TypeOrmModule.forFeature([BordColumn])],
  providers: [BordColumnService],
  controllers: [BordColumnController],
})
export class ColumnModule {}
