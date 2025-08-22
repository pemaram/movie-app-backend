import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshJwtTokenDTO {
  @ApiProperty({ example: 'token' })
  @IsString()
  @IsNotEmpty()
  refresh: string;
}

export class CreateAuthDto {}
