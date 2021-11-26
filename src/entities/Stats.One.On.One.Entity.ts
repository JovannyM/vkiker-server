import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class StatsOneOnOne {
  @PrimaryColumn()
  id: string;

  @Column()
  wins: number;

  @Column()
  battles: number;

  @Column()
  goalsScored: number;

  @Column()
  goalsConceded: number;

  @Column()
  averageGoalsConcededInWin: number;

  @Column()
  averageGoalsScoredInDefeat: number;
}
