import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board/entities/board.entity';

@Module({
  imports: [BoardModule, TypeOrmModule.forRoot({ 
  type: 'mysql',
  host: 'express-database.czyokzgn9ldt.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'root',
  password: 'qwer1234',
  database: 'kanban',
  entities: [Board],
  synchronize: true,})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
