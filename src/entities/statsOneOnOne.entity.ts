import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseStats } from './baseStats.entity';

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

  @OneToOne(() => BaseStats)
  @JoinColumn()
  baseStats: BaseStats;
}
