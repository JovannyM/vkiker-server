import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
