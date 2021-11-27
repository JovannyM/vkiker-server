import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [BattleController],
  providers: [BattleService],
})
export class BattleModule {}
