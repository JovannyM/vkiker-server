import { Controller, Get, Param } from '@nestjs/common';

import { UserStatsService } from '../userStats/userStats.service';
import { UserStatsDTO } from '../dto/userStatsDTO';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userStatesService: UserStatsService,
  ) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserStatsDTO> {
    const user = await this.userService.getById(id);
    const statsOne = await this.userStatesService.getStatsOneOnOne(
      user.statsOneOnOneId,
    );
    statsOne.baseStats = await this.userStatesService.getBaseStatsById(
      statsOne.baseStatsId,
    );
    user.statsOneOnOne = statsOne;
    const statsTwo = await this.userStatesService.getStatsTwoOnTwo(
      user.statsTwoOnTwoId,
    );
    statsTwo.baseStats = await this.userStatesService.getBaseStatsById(
      statsTwo.baseStatsId,
    );
    user.statsTwoOnTwo = statsTwo;
    return {
      id: user.id,
      name: user.name,
      statsOneOnOne: {
        battles: user.statsOneOnOne.battles,
        elo: user.statsOneOnOne.baseStats.elo,
        wins: user.statsOneOnOne.wins,
        goalsScored: user.statsOneOnOne.goalsScored,
        goalsConceded: user.statsOneOnOne.goalsConceded,
        averageWinDuration: user.statsOneOnOne.baseStats.averageWinDuration,
        averageDefeatDuration:
          user.statsOneOnOne.baseStats.averageDefeatDuration,
        averageGoalsConcededInWin: user.statsOneOnOne.averageGoalsConcededInWin,
        averageGoalsScoredInDefeat:
          user.statsOneOnOne.averageGoalsScoredInDefeat,
      },
      statsTwoOnTwo: {
        elo: user.statsTwoOnTwo.baseStats.elo,
        battlesInAttack: user.statsTwoOnTwo.battlesInAttack,
        battlesInDefense: user.statsTwoOnTwo.battlesInDefense,
        winsInAttack: user.statsTwoOnTwo.winsInAttack,
        winsInDefense: user.statsTwoOnTwo.winsInDefense,
        averageWinDuration: user.statsTwoOnTwo.baseStats.averageWinDuration,
        averageDefeatDuration:
          user.statsTwoOnTwo.baseStats.averageDefeatDuration,
      },
    };
  }
}
