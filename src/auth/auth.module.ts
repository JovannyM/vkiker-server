import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';

import { StatsOneOnOne } from 'src/entities/statsOneOnOne.entity';
import { StatsTwoOnTwo } from 'src/entities/statsTwoOnTwo.entity';
import { BaseStats } from 'src/entities/baseStats.entity';

import { AuthController } from './auth.controller';
import { UserStatsService } from 'src/userStats/userStats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StatsOneOnOne, StatsTwoOnTwo, BaseStats]),
  ],
  controllers: [AuthController],
  providers: [UserService, UserStatsService],
})
export class AuthModule { }
