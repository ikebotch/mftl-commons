import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class ProjectEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, select: false })
  projectId: string;
}
