import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class BaseStats {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ default: 0 })
  elo: number;

  @Column({ default: 0 })
  averageWinDuration: number;

  @Column({ default: 0 })
  averageDefeatDuration: number;
}
