import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({
    nullable: true,
    select: false,
  })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt!: Date;
}
