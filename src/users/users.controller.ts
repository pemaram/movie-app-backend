import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@ApiTags('Users')
@Controller('web/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page' })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Limit',
  })
  @UseGuards(JwtGuard)
  @Get('paginated')
  async getPaginatedUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.usersService.getPaginatedUsers(page, limit);
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

  @ApiBody({ type: CreateUserDto })
  @Post('upsert')
  async upsert(@Body() request: CreateUserDto) {
    try {
      const result = await this.usersService.upsert(request);
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
