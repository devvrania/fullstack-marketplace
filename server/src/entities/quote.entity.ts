import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Case } from './case.entity';

export type QuoteStatus = 'proposed' | 'accepted' | 'rejected';

@Entity('quotes')
@Index('UQ_quote_per_lawyer_case', ['caseId', 'lawyerId'], { unique: true })
export class Quote {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    caseId!: string;

    @Column({ type: 'uuid' })
    lawyerId!: string;

    @ManyToOne(() => Case, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'caseId' })
    case!: Case;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lawyerId' })
    lawyer!: User;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount!: string; // keep as string to preserve decimal precision

    @Column({ type: 'integer' })
    expectedDays!: number;

    @Column({ type: 'text', nullable: true })
    note?: string | null;

    @Column({ type: 'varchar', length: 20, default: 'proposed' })
    status!: QuoteStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
