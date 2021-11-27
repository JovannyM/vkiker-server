import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { User } from '../entities/user.entity';
import { CreateDuelDTO } from '../dto/createDuelDTO';

import { LobbyObject } from './lobbyObject';
import { DuelResultDTO } from 'src/dto/duelResultDTO';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BattleService {
  private lobby: LobbyObject;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) {
    this.lobby = new LobbyObject();
  }

  async inviteUserToDuelInFireBase(userIds: CreateDuelDTO) {
    if (this.lobby.isBusy) {
      return { access: false };
    }
    const sender = await this.userRepository.findOne({
      where: { id: userIds.senderId },
    });
    const opponent = await this.userRepository.findOne({
      where: { id: userIds.opponentId },
    });
    const inviteData = {
      data: {
        duelWithId: `${userIds.senderId}`,
        duelWithName: `${sender.name}`,
      },
    };
    await admin.messaging().sendToDevice(opponent.fcmToken, inviteData);
  }

  async acceptDuel(userIds: CreateDuelDTO) {
    this.lobby.attackTeamA.userId = userIds.senderId;
    this.lobby.attackTeamB.userId = userIds.opponentId;
    const Data = {
      data: {
        goLobby: 'access',
      },
    };
    const senderToken = await this.getTokenByUserId(userIds.senderId);
    const opponentToken = await this.getTokenByUserId(userIds.opponentId);
    await admin.messaging().sendToDevice(senderToken, Data);
    await admin.messaging().sendToDevice(opponentToken, Data);
  }

  async readyToBattle(userId: string) {
    if (this.lobby.attackTeamA.userId === userId) {
      this.lobby.attackTeamA.readyToBattle = true;
    }
    if (this.lobby.attackTeamB.userId === userId) {
      this.lobby.attackTeamB.readyToBattle = true;
    }
    if (
      this.lobby.attackTeamA.readyToBattle &&
      this.lobby.attackTeamB.readyToBattle
    ) {
      const message = {
        data: {
          start: 'access',
        },
      };
      const teamA = await this.getTokenByUserId(this.lobby.attackTeamA.userId);
      const teamB = await this.getTokenByUserId(this.lobby.attackTeamB.userId);
      await admin.messaging().sendToDevice(teamA, message);
      await admin.messaging().sendToDevice(teamB, message);
      this.lobby.startBattle = new Date();
    }
  }

  async stopBattle(userId: string) {
    if (this.lobby.attackTeamA.userId === userId) {
      this.lobby.attackTeamA.readyToBattle = false;
    }
    if (this.lobby.attackTeamB.userId === userId) {
      this.lobby.attackTeamB.readyToBattle = false;
    }
    if (
      !this.lobby.attackTeamA.readyToBattle &&
      !this.lobby.attackTeamB.readyToBattle
    ) {
      const message = {
        data: {
          stop: 'access',
        },
      };
      const teamA = await this.getTokenByUserId(this.lobby.attackTeamA.userId);
      const teamB = await this.getTokenByUserId(this.lobby.attackTeamB.userId);
      await admin.messaging().sendToDevice(teamA, message);
      await admin.messaging().sendToDevice(teamB, message);
    }
  }

  private finished: number = 0;
  private secondIsWinner: boolean = false;
  private secondIsLoser: boolean = false;
  private winnerId: string;
  private loserId: string;
  private goals: number;

  async processDuelResult(duelResult: DuelResultDTO) {
    if (this.finished == 0) {
      this.goals = duelResult.goals;
    } else {
      if (this.goals != duelResult.goals) return { returnCode: 400 };
    }

    if (duelResult.winner) {
      if (this.secondIsLoser) return { returnCode: 400 };
      this.secondIsLoser = true;
      this.winnerId = duelResult.id;
    } else {
      if (this.secondIsWinner) return { returnCode: 400 };
      this.secondIsWinner = true;
      this.loserId = duelResult.id;
    }

    this.finished++;

    if (this.finished == 2) {
      this.finished = 0;
      this.secondIsWinner = false;
      this.secondIsLoser = false;
      const duration: number = (new Date()).getTime() - this.lobby.startBattle.getTime();
      this.userService.updateAfterDuel(this.winnerId, this.loserId, duelResult.goals, duration);
      return { returnCode: 200 };
    }
  }

  async getTokenByUserId(userId: string) {
    return (await this.userRepository.findOne({ where: { id: userId } }))
      .fcmToken;
  }
}
