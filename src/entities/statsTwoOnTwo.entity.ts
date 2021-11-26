import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseStats } from './baseStats.entity';

@Entity()
export class StatsTwoOnTwo {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  baseStatsId: string;

  @Column({ default: 0 })
  winsInAttack: number;

  @Column({ default: 0 })
  battlesInAttack: number;

  @Column({ default: 0 })
  winsInDefense: number;

  @Column({ default: 0 })
  battlesInDefense: number;

  @OneToOne(() => BaseStats)
  @JoinColumn()
  baseStats: BaseStats;
}
