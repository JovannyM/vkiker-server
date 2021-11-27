import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { User } from '../entities/user.entity';
import { CreateDuelDTO } from '../dto/createDuelDTO';

import { LobbyObject } from './lobbyObject';

@Injectable()
export class BattleService {
  private lobby: LobbyObject;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.lobby = new LobbyObject();
    console.log(this.lobby);
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

  async getTokenByUserId(userId: string) {
    return (await this.userRepository.findOne({ where: { id: userId } }))
      .fcmToken;
  }
}
