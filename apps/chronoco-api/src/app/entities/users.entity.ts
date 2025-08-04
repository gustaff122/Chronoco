import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';

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

  @Column({ length: 64, default: 'USER' })
  role: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
