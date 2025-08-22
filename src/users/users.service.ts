import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaConnectionService } from 'src/prisma-connection/prisma-connection.service';
import utils from 'src/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaConnection: PrismaConnectionService) {}

  async getPaginatedUsers(page: number, limit: number) {
    const _page = utils.convertedValue(page);
    const _limit = utils.convertedValue(limit);
    const skip = (_page - 1) * _limit;
    const data = await this.prismaConnection.users.aggregateRaw({
      pipeline: [
        {
          $match: { status: true },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: _limit,
        },
      ],
    });

    return {
      status: true,
      message: 'Users fetched successfully',
      data,
    };
  }

  async upsert(request: CreateUserDto) {
    let data: any;

    if (request._id) {
      const checkMovieExists = await this.prismaConnection.users.findFirst({
        where: { id: request._id },
      });

      if (!checkMovieExists) {
        throw new Error('Users details not found');
      }

      data = await this.prismaConnection.users.update({
        where: { id: request._id },
        data: {
          email: request.email,
          updatedAt: new Date(),
          status: request.status,
        },
      });
    } else {
      const hashedNewPassword = await bcrypt.hash(request.password, 10);
      data = await this.prismaConnection.users.create({
        data: {
          email: request.email,
          password: hashedNewPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: request.status,
        },
      });
    }
    return {
      status: true,
      message: 'Users upsert successfully',
      data,
    };
  }
}
