import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { StatsOneOnOne } from '../entities/statsOneOnOne.entity';
import { StatsTwoOnTwo } from '../entities/statsTwoOnTwo.entity';
import { BaseStats } from '../entities/baseStats.entity';

import { UserStatsService } from 'src/userStats/userStats.service';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StatsOneOnOne, StatsTwoOnTwo, BaseStats]),
  ],
  providers: [UserService, UserStatsService],
  controllers: [UserController],
})
export class UserModule {}
