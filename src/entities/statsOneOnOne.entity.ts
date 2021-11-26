import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseStats } from './baseStats.entity';

@Entity()
export class StatsOneOnOne {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  baseStatsId: string;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  battles: number;

  @Column({ default: 0 })
  goalsScored: number;

  @Column({ default: 0 })
  goalsConceded: number;

  @Column({ default: 0 })
  averageGoalsConcededInWin: number;

  @Column({ default: 0 })
  averageGoalsScoredInDefeat: number;

  @OneToOne(() => BaseStats)
  @JoinColumn()
  baseStats: BaseStats;
}
