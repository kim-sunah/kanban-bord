import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
export class RegisterDto extends PickType(User, [
  'email',
  'password',
  'name',
]) {}
