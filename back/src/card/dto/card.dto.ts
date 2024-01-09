import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsDateString,
} from 'class-validator';

export class CardDto {
  @IsString({ message: '카드 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '카드 이름을 입력해주세요.' })
  name: string;

  @IsString({ message: '카드 설명은 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  description: string | undefined;

  @IsString({ message: '카드 색깔은 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  color: string | undefined;

  @IsDateString({}, { message: '데드라인은 시간 형식 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '데드라인이 비어있습니다.' })
  deadline: string;
}

export class UpdateCardDto {
  @IsString({ message: '카드 이름은 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  name: string | undefined;

  @IsString({ message: '카드 설명은 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  description: string | undefined;

  @IsString({ message: '카드 색깔은 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  color: string | undefined;

  @IsDateString({}, { message: '데드라인은 시간 형식 문자열이어야 합니다.' })
  @ValidateIf((o, v) => v !== undefined)
  deadline: string | undefined;
}
