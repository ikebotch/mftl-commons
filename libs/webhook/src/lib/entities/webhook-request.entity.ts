import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'webhook_requests' })
export class WebhookRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', default: '', nullable: true })
  event!: string;

  @Column({ type: 'varchar', default: '', nullable: true })
  registeredUrl!: string;

  @Column({ type: 'json', nullable: true })
  body!: any;

  @CreateDateColumn({ select: true })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ select: false })
  deletedAt!: Date;
}
