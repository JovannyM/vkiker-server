import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Battles {
  @PrimaryColumn()
  id: string;

  @Column()
  attackAid: string;

  @Column()
  attackBid: string;

  @Column()
  defenseAid: string;

  @Column()
  defenseBid: string;
}
