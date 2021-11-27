import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseStats } from 'src/entities/baseStats.entity';
import { StatsOneOnOne } from 'src/entities/statsOneOnOne.entity';
import { StatsTwoOnTwo } from 'src/entities/statsTwoOnTwo.entity';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(BaseStats)
    private readonly baseStatsRepository: Repository<BaseStats>,
    @InjectRepository(StatsOneOnOne)
    private readonly statsOneOnOneRepository: Repository<StatsOneOnOne>,
    @InjectRepository(StatsTwoOnTwo)
    private readonly statsTwoOnTwoRepository: Repository<StatsTwoOnTwo>,
  ) { }

  async createBaseStats(id: string) {
    const bs = new BaseStats();
    bs.id = id;
    return await this.baseStatsRepository.save(bs);
  }

  async updateBaseStats(id: string, elo: number, averageWinDuration: number, averageDefeatDuration: number) {
    const bs = new BaseStats();
    bs.id = id;
    bs.elo = elo;
    bs.averageWinDuration = averageWinDuration;
    bs.averageDefeatDuration = averageDefeatDuration;
    return await this.baseStatsRepository.save(bs);
  }

  async createStatsOneOnOne(id: string, baseStatsId: string) {
    const ooo = new StatsOneOnOne();
    ooo.id = id;
    ooo.baseStatsId = baseStatsId;
    return await this.statsOneOnOneRepository.save(ooo);
  }

  async updateStatsOneOnOne(id: string, baseStatsId: string, wins: number, battles: number, goalsScored: number, goalsConceded: number, averageGoalsConcededInWin: number, averageGoalsScoredInDefeat: number) {
    const ooo = new StatsOneOnOne();
    ooo.id = id;
    ooo.baseStatsId = baseStatsId;
    ooo.wins = wins;
    ooo.battles = battles;
    ooo.goalsScored = goalsScored;
    ooo.goalsConceded = goalsConceded;
    ooo.averageGoalsConcededInWin = averageGoalsConcededInWin;
    ooo.averageGoalsScoredInDefeat = averageGoalsScoredInDefeat;
    return await this.statsOneOnOneRepository.save(ooo);
  }

  async createStatsTwoOnTwo(id: string, baseStatsId: string) {
    const tot = new StatsTwoOnTwo();
    tot.id = id;
    tot.baseStatsId = baseStatsId;
    return await this.statsTwoOnTwoRepository.save(tot);
  }

  async updateStatsTwoOnTwo(id: string, baseStatsId: string, winsInAttack: number, battlesInAttack: number, winsInDefense: number, battlesInDefense: number) {
    const tot = new StatsTwoOnTwo();
    tot.id = id;
    tot.baseStatsId = baseStatsId;
    tot.winsInAttack = winsInAttack;
    tot.battlesInAttack = battlesInAttack;
    tot.winsInDefense = winsInDefense;
    tot.battlesInDefense = battlesInDefense;
    return await this.statsTwoOnTwoRepository.save(tot);
  }

  async getBaseStatsById(id: string) {
    const baseStats = await this.baseStatsRepository.findOne(id);
    if (baseStats) {
      return baseStats;
    }
    throw new Error(`BaseStats by ID ${id} not found`);
  }

  async getStatsOneOnOne(id: string) {
    const statsOneOnOne = await this.statsOneOnOneRepository.findOne(id);
    if (statsOneOnOne) {
      return statsOneOnOne;
    }
    throw new Error(`StatsOneOnOne by ID ${id} not found`);
  }

  async getStatsTwoOnTwo(id: string) {
    const statsTwoOnTwo = await this.statsTwoOnTwoRepository.findOne(id);
    if (statsTwoOnTwo) {
      return statsTwoOnTwo;
    }
    throw new Error(`StatsOneOnOne by ID ${id} not found`);
  }
}
