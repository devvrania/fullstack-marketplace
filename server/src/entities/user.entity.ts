import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export type UserRole = 'client' | 'lawyer';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  role!: UserRole;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jurisdiction?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  barNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase();
  }
}
