import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { StatsOneOnOne } from './statsOneOnOne.entity';
import { StatsTwoOnTwo } from './statsTwoOnTwo.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  statsOneOnOneId: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  statsTwoOnTwoId: string;

  @Column()
  fcmToken: string;

  @Column()
  name: string;

  @OneToOne(() => StatsOneOnOne)
  @JoinColumn({ name: 'statsOneOnOneId', referencedColumnName: 'id' })
  statsOneOnOne: StatsOneOnOne;

  @OneToOne(() => StatsTwoOnTwo)
  @JoinColumn({ name: 'statsTwoOnTwoId', referencedColumnName: 'id' })
  statsTwoOnTwo: StatsTwoOnTwo;
}
