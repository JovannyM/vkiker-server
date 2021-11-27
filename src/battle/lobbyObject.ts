import { UserBattleState } from './battleState';

export class LobbyObject {
  public isBusy: boolean;
  public startBattle: Date;
  public attackTeamA: UserBattleState;
  public defenceTeamA: UserBattleState;
  public attackTeamB: UserBattleState;
  public defenceTeamB: UserBattleState;
}
