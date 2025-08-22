import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpsertMovieDTO } from './dto/create-movie.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadImage } from 'src/upload-logic/upload-image.decorator';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('Movies')
@Controller('web/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page' })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limit',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID',
  })
  @UseGuards(JwtGuard)
  @Get('paginated')
  async getPaginatedMovies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId: string = '',
  ) {
    try {
      const result = await this.moviesService.getPaginatedMovies(
        page,
        limit,
        userId,
      );
      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: error.message || 'Something went wrong',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtGuard)
  @Post('upsert')
  @UploadImage('poster_url')
  async upsert(
    @UploadedFile() file: Express.Multer.File,
    @Body() request: UpsertMovieDTO,
  ) {
    try {
      const request_data = {
        ...request,
        poster_url: file.filename,
      };
      const result = await this.moviesService.upsert(request_data);
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `Unique constraint failed on field: ${error.meta?.target}`,
        );
      }

      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }
}
