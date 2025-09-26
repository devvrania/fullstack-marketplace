import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { CaseFile } from './caseFile.entity';

export type CaseStatus = 'open' | 'engaged' | 'closed' | 'cancelled';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  clientId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client!: User;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 120 })
  category!: string;

  // Full description is never shown to lawyers until engagement
  @Column({ type: 'text' })
  descriptionFull!: string;

  // Redacted for marketplace previews (emails/phones removed)
  @Column({ type: 'text' })
  descriptionRedacted!: string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status!: CaseStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => CaseFile, (f) => f.case)
  files!: CaseFile[];
}
