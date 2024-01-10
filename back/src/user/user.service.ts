import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
  async update(updateDto: UpdateDto, user: User) {
    await this.userRepository.update(user, { name: updateDto.name });
  }
  async delete(user: User) {
    return await this.userRepository.delete(user);
  }
}
