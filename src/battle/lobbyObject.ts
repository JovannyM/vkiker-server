import { UserBattleState } from './battleState';

export class LobbyObject {
  public isBusy: boolean;
  public startBattle: Date;
  public attackTeamA: UserBattleState;
  public defenceTeamA: UserBattleState;
  public attackTeamB: UserBattleState;
  public defenceTeamB: UserBattleState;

  constructor() {
    this.isBusy = false;
    this.startBattle = null;
    this.attackTeamA = { userId: '', readyToBattle: false };
    this.attackTeamB = { userId: '', readyToBattle: false };
    this.defenceTeamA = { userId: '', readyToBattle: false };
    this.defenceTeamB = { userId: '', readyToBattle: false };
  }
}
