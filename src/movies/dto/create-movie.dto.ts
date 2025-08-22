import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertMovieDTO {
  @ApiProperty({ example: '6123456789abcdef01234567 || null', required: false })
  @IsString()
  @IsOptional()
  _id: string;

  @ApiProperty({ example: 'The Great Book' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 2023 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({ example: '6123456789abcdef01234567', required: true })
  @IsString()
  @IsNotEmpty()
  userId: string
}
