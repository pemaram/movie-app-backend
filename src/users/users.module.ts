import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaConnectionModule } from 'src/prisma-connection/prisma-connection.module';

@Module({
  imports: [PrismaConnectionModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
