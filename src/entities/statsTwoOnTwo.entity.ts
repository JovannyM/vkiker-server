import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseStats } from './baseStats.entity';

@Entity()
export class StatsTwoOnTwo {
  @PrimaryColumn()
  id: string;

  @Column()
  winsInAttack: number;

  @Column()
  battlesInAttack: number;

  @Column()
  winsInDefense: number;

  @Column()
  battlesInDefense: number;

  @OneToOne(() => BaseStats)
  @JoinColumn()
  baseStats: BaseStats;
}
