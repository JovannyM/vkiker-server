import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class BaseStats {
  @PrimaryColumn()
  id: string;

  @Column()
  elo: number;

  @Column()
  averageWinDuration: number;

  @Column()
  averageDefeatDuration: number;
}
