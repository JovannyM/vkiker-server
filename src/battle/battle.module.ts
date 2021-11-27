import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { UserService } from 'src/user/user.service';
import { UserStatsService } from 'src/userStats/userStats.service';
import { BaseStats } from 'src/entities/baseStats.entity';
import { StatsOneOnOne } from 'src/entities/statsOneOnOne.entity';
import { StatsTwoOnTwo } from 'src/entities/statsTwoOnTwo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BaseStats, StatsOneOnOne, StatsTwoOnTwo])],
  controllers: [BattleController],
  providers: [BattleService, UserService, UserStatsService],
})
export class BattleModule { }
