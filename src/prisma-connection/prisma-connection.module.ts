import { Module } from '@nestjs/common';
import { PrismaConnectionService } from './prisma-connection.service';

@Module({
  controllers: [],
  providers: [PrismaConnectionService],
  exports: [PrismaConnectionService],
})
export class PrismaConnectionModule {}
