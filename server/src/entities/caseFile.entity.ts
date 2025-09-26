import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Case } from './case.entity';
  
  @Entity('case_files')
  export class CaseFile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'uuid' })
    @Index()
    caseId!: string;
  
    @ManyToOne(() => Case, (c) => c.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'caseId' })
    case!: Case;
  
    @Column({ type: 'varchar', length: 255 })
    filename!: string; // e.g. "contract.pdf"
  
    @Column({ type: 'varchar', length: 255 })
    originalName!: string; // original uploaded filename
  
    @Column({ type: 'varchar', length: 100 })
    mimeType!: string;

    @Column({ type: 'bigint' })
    size!: number; // bytes
  
    @CreateDateColumn()
    createdAt!: Date;
  }
  