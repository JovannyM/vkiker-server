import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { User } from '../entities/user.entity';
import { UserShortDTO } from '../dto/userShortDTO';
import { UserStatsDTO } from '../dto/userStatsDTO';

import { UserStatsService } from 'src/userStats/userStats.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userStatsService: UserStatsService,
  ) { }

  async getAll(): Promise<UserShortDTO[]> {
    const users = await this.userRepository.find();
    const filledUsers = await Promise.all(
      users.map((user) => this.fillUser(user)),
    );
    return filledUsers.map((user) => ({
      user: {
        id: user.user.id,
        name: user.user.name,
      },
      elo: user.statsTwoOnTwo.elo,
      battles: user.statsOneOnOne.battles,
      wins: user.statsOneOnOne.wins,
    }));
  }

  async create(
    userDTO: UserAuthDTO,
  ): Promise<{ access: boolean; message: string; id: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { name: userDTO.userName },
    });
    if (existingUser) {
      return {
        access: false,
        message: 'User with this name already exists',
        id: '0',
      };
    }
    const user = new User();
    user.id = uuidv4();
    const oooBsId = uuidv4();
    const totBsId = uuidv4();
    user.fcmToken = userDTO.fcmToken;
    user.name = userDTO.userName;
    user.statsOneOnOneId = user.id;
    user.statsTwoOnTwoId = user.id;
    await this.userStatsService.createBaseStats(oooBsId);
    await this.userStatsService.createBaseStats(totBsId);
    await this.userStatsService.createStatsOneOnOne(user.id, oooBsId);
    await this.userStatsService.createStatsTwoOnTwo(user.id, totBsId);

    const newUser = await this.userRepository.save(user);
    return {
      access: true,
      message: '',
      id: newUser.id,
    };
  }

  async getByName(
    name: string,
  ): Promise<{ access: boolean; message: string; id: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { name },
    });
    if (existingUser) {
      return {
        access: true,
        message: '',
        id: existingUser.id,
      };
    }
    return {
      access: false,
      message: 'User with this name does not exist',
      id: '0',
    };
  }

  async getById(id: string): Promise<UserStatsDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User by ID ${id} not found`);
    }
    return this.fillUser(user);
  }

  async fillUser(user: User): Promise<UserStatsDTO> {
    const statsOne = await this.userStatsService.getStatsOneOnOne(
      user.statsOneOnOneId,
    );
    statsOne.baseStats = await this.userStatsService.getBaseStatsById(
      statsOne.baseStatsId,
    );
    user.statsOneOnOne = statsOne;
    const statsTwo = await this.userStatsService.getStatsTwoOnTwo(
      user.statsTwoOnTwoId,
    );
    statsTwo.baseStats = await this.userStatsService.getBaseStatsById(
      statsTwo.baseStatsId,
    );
    user.statsTwoOnTwo = statsTwo;
    return {
      user: {
        id: user.id,
        name: user.name,
      },
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

  async update(userDTO: UserAuthDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { name: userDTO.userName },
    });
    if (!existingUser) {
      return {
        access: false,
        message: 'User with this name not found',
        id: '0',
      };
    }
    existingUser.fcmToken = userDTO.fcmToken;
    await this.userRepository.save(existingUser);
  }

  async updateUser(id: string, user: UserStatsDTO) {
    const u = await this.userRepository.findOne({
      where: { id },
    });
    const o = user.statsOneOnOne;
    const t = user.statsTwoOnTwo;
    const oooBsId = u.statsOneOnOne.baseStats.id;
    const totBsId = u.statsTwoOnTwo.baseStats.id;
    await this.userStatsService.updateBaseStats(oooBsId, o.elo, o.averageWinDuration, o.averageDefeatDuration);
    await this.userStatsService.updateBaseStats(totBsId, t.elo, t.averageWinDuration, t.averageDefeatDuration);
    await this.userStatsService.updateStatsOneOnOne(id, oooBsId, o.wins, o.battles, o.goalsScored, o.goalsConceded, o.averageGoalsConcededInWin, o.averageGoalsScoredInDefeat);
    await this.userStatsService.updateStatsTwoOnTwo(id, totBsId, t.winsInAttack, t.battlesInAttack, t.winsInDefense, t.battlesInDefense);
    await this.userRepository.save(user);
  }

  async updateAfterDuel(winnerId: string, loserId: string, goals: number, duration: number) {
    const winner: UserStatsDTO = await this.getById(winnerId);
    const loser: UserStatsDTO = await this.getById(loserId);
    const w = winner.statsOneOnOne;
    const l = loser.statsOneOnOne;
    w.elo += (10 - goals + 60000 / duration) ** (0.5 + l.elo / w.elo);
    l.elo -= (10 - goals + 60000 / duration) ** (l.elo / w.elo);
    w.averageGoalsConcededInWin = (w.averageGoalsConcededInWin * w.wins + goals) / (w.wins + 1);
    l.averageGoalsScoredInDefeat = (l.averageGoalsScoredInDefeat * (l.battles - l.wins) + goals) / (l.wins + 1);
    w.averageWinDuration = (w.averageWinDuration * w.battles + duration) / (w.battles + 1);
    l.averageDefeatDuration = (l.averageDefeatDuration * l.battles + duration) / (l.battles + 1);
    w.wins++;
    w.battles++;
    l.battles++;
    w.goalsScored += 10;
    l.goalsScored += goals;
    w.goalsConceded += goals;
    l.goalsConceded += 10;
    winner.statsOneOnOne = w;
    loser.statsOneOnOne = l;
    await this.updateUser(winner.user.id, winner);
    await this.updateUser(loser.user.id, loser);
  }
}
