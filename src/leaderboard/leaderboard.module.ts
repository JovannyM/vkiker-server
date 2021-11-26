import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';

import { LeaderboardController } from './leaderboard.controller';
import { UserStatsService } from 'src/userStats/userStats.service';
import { StatsTwoOnTwo } from 'src/entities/statsTwoOnTwo.entity';
import { StatsOneOnOne } from 'src/entities/statsOneOnOne.entity';
import { BaseStats } from 'src/entities/baseStats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, StatsOneOnOne, StatsTwoOnTwo, BaseStats])],
  controllers: [LeaderboardController],
  providers: [UserService, UserStatsService],
})
export class LeaderboardModule { }
