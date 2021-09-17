import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ default: new Date().toISOString(), nullable: true })
  createdAt: string;

  @UpdateDateColumn({
    default: new Date().toISOString(),
    nullable: true,
    select: false,
  })
  updatedAt: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: string;
}
