import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateDuelDTO } from '../dto/createDuelDTO';

import { DuelResultDTO } from '../dto/duelResultDTO';

import { BattleService } from './battle.service';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) { }

  @Get('lobby')
  async lobbyIsBusy() {
    return await this.battleService.lobbyIsBusy();
  }

  @Post('duel')
  async createDuel(
    @Body() userIds: CreateDuelDTO,
  ): Promise<{ access: boolean }> {
    await this.battleService.inviteUserToDuelInFireBase(userIds);
    return { access: true };
  }

  @Post('accept')
  async acceptDuel(@Body() userIds: CreateDuelDTO) {
    await this.battleService.acceptDuel(userIds);
  }

  @Get('ready/:id')
  async readyToBattle(@Param('id') userId: string) {
    await this.battleService.readyToBattle(userId);
  }

  @Get('stop/:id')
  async stopBattle(@Param('id') userId: string) {
    await this.battleService.stopBattle(userId);
  }

  @Post('result')
  async processDuelResult(@Body() duelResult: DuelResultDTO) {
    await this.battleService.processDuelResult(duelResult);
  }
}
