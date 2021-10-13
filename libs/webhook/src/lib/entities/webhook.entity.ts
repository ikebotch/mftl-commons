import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'webhook' })
export class WebhookEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  event!: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  registeredUrl!: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  clientId!: string;

  @CreateDateColumn({ select: true })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ select: false })
  deletedAt!: Date;
}


