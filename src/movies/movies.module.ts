import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaConnectionModule } from 'src/prisma-connection/prisma-connection.module';

@Module({
  imports: [PrismaConnectionModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
