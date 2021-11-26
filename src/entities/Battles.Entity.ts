import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Battles {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  attackAid: string;

  @Column({ type: 'uuid', nullable: false })
  attackBid: string;

  @Column({ type: 'uuid' })
  defenseAid: string;

  @Column({ type: 'uuid' })
  defenseBid: string;
}
