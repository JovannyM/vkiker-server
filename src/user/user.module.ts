import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatsService } from 'src/userStats/userStats.service';

import { User } from '../entities/user.entity';

import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserStatsService],
})
export class UserModule { }
