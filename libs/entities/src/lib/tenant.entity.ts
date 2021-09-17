import { Column } from 'typeorm';
import { ProjectEntity } from './project.entity';

export class TenantedEntity extends ProjectEntity {
  @Column({ nullable: false, type: 'varchar', select: false })
  tenantId: string;
}
