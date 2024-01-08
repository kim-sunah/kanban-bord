import { Test, TestingModule } from '@nestjs/testing';
import { BoardColumnController } from './column.controller';

describe('ColumnController', () => {
  let controller: BoardColumnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardColumnController],
    }).compile();

    controller = module.get<BoardColumnController>(BoardColumnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
