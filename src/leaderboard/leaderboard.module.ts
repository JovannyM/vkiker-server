import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';

import { LeaderboardController } from './leaderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [LeaderboardController],
  providers: [UserService],
})
export class LeaderboardModule {}
