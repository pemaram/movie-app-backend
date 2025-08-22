import { PartialType } from '@nestjs/mapped-types';
import { UpsertMovieDTO } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(UpsertMovieDTO) {}
