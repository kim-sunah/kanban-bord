import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, name }: RegisterDto) {
    // 이미 가입된 회원 확인
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });
    delete user.password;

    return user;
  }

  async validate({ email, password }: LoginDto) {
    const existedUser = await this.userRepository.findOne({
      where: { email },
      select: { userSeq: true, password: true },
    });

    // 회원이 존재하지 않을 때
    if (!existedUser) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    // 비밀번호가 일치하지 않을 때
    const isPasswordMatched = await bcrypt.compareSync(
      password,
      existedUser.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return { userSeq: existedUser.userSeq };
  }

  async login(id: number) {
    const accessToken = await this.createAccessToken(id);
    return { accessToken };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async createAccessToken(id: number) {
    return await this.jwtService.signAsync({ id }, { expiresIn: '1d' });
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verify(accessToken);

      return { success: true, id: payload.id };
    } catch (error) {
      const payload = await this.jwtService.verify(accessToken, {
        ignoreExpiration: true,
      });

      return { success: false, message: error.message, id: payload.id };
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
