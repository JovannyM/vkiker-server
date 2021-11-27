import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class BaseStats {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ type: 'real', default: 100 })
  elo: number;

  @Column({ type: 'real', default: 0 })
  averageWinDuration: number;

  @Column({ type: 'real', default: 0 })
  averageDefeatDuration: number;
}
