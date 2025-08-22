import { Injectable } from '@nestjs/common';
import { PrismaConnectionService } from 'src/prisma-connection/prisma-connection.service';
import utils from 'src/utils';
import mongoose from 'mongoose';

@Injectable()
export class MoviesService {
  constructor(private readonly prismaConnection: PrismaConnectionService) {}

  async getPaginatedMovies(page: number, limit: number, userId: string) {
    const _page = utils.convertedValue(page);
    const _limit = utils.convertedValue(limit);
    const skip = (_page - 1) * _limit;
    const usersId = new mongoose.Types.ObjectId(userId);
    const totalDocs = await this.prismaConnection.movie.count({
      where: {
        userId: usersId.toString(),
        status: true,
      },
    });

    const data = await this.prismaConnection.movie.aggregateRaw({
      pipeline: [
        { $match: { userId: { $oid: userId }, status: true } },
        {
          $project: {
            _id: 1,
            title: 1,
            year: 1,
            poster_url: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1,
            userId: 1,
          },
        },
        { $skip: skip },
        { $limit: _limit },
      ],
    });

    return {
      status: true,
      message: 'Movies fetched successfully',
      totalDocs,
      currentPage: _page,
      totalPages: Math.ceil(totalDocs / _limit),
      data,
    };
  }

  async upsert(request: any) {
    let data: any;

    if (request._id) {
      const checkMovieExists = await this.prismaConnection.movie.findFirst({
        where: { id: request._id },
      });

      if (!checkMovieExists) {
        throw new Error('Movie details not found');
      }

      data = await this.prismaConnection.movie.update({
        where: { id: request._id },
        data: {
          title: request.title,
          year: Number(request.year),
          poster_url: request.poster_url,
          updatedAt: new Date(),
          status: Boolean(request.status),
          userId: request.userId,
        },
      });
    } else {
      data = await this.prismaConnection.movie.create({
        data: {
          title: request.title,
          year: Number(request.year),
          poster_url: request.poster_url,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: Boolean(request.status),
          userId: request.userId,
        },
      });
    }
    return {
      status: true,
      message: 'Movies upsert successfully',
      data,
    };
  }
}
