export interface UserStatsDTO {
  id: string;
  name: string;
  statsOneOnOne: {
    elo: number;
    battles: number;
    wins: number;
    goalsScored: number;
    goalsConceded: number;
    averageGoalsConcededInWin: number;
    averageGoalsScoredInDefeat: number;
    averageWinDuration: number;
    averageDefeatDuration: number;
  };
  statsTwoOnTwo: {
    elo: number;
    winsInAttack: number;
    battlesInAttack: number;
    winsInDefense: number;
    battlesInDefense: number;
    averageWinDuration: number;
    averageDefeatDuration: number;
  };
}
