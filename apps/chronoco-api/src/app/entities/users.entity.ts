import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';

@Entity()
export class Users {
  @PrimaryColumn('char', { length: 26 })
  id: string;

  @Column({ length: 64 })
  login: string;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 128 })
  password: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }
}
