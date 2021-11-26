import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { StatsOneOnOne } from './statsOneOnOne.entity';
import { StatsTwoOnTwo } from './statsTwoOnTwo.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  fcmToken: string;

  @Column()
  name: string;

  @OneToOne(() => StatsOneOnOne)
  @JoinColumn()
  statsOneOnOne: StatsOneOnOne;

  @OneToOne(() => StatsTwoOnTwo)
  @JoinColumn()
  statsTwoOnTwo: StatsTwoOnTwo;
}
