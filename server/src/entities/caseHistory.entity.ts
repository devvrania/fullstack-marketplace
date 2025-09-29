import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Case } from "./case.entity";

@Entity()
export class CaseHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  caseId!: string;

  @ManyToOne(() => Case, (kase) => kase.history, { onDelete: "CASCADE" })
  kase!: Case;

  @Column()
  action!: string; // e.g. created, quote_proposed, engaged, file_uploaded, completed, closed

  @Column({ nullable: true })
  actorId!: string; // user (client/lawyer) who did it

  @Column({ nullable: true })
  note!: string; // optional details

  @CreateDateColumn()
  createdAt!: Date;
}
