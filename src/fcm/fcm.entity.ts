import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: false, database: 'meet', name: 'tb_mobile_token' })
export class tb_mobile_token {
  @PrimaryGeneratedColumn()
  token: string;

  @Column()
  ip: string;

  @Column()
  userid: string;

  @Column()
  regdt: string;

  @Column()
  uptdt: string;

  @Column()
  bigo: string;
}
