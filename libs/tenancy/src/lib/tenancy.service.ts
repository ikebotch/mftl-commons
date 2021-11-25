import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenancyService {
  private tenantId = '';
  private projectId = '';

  public get tenancy(): string {
    return this.tenantId;
  }

  public set tenancy(tenantId: string) {
    this.tenantId = tenantId;
  }

  public get project(): string {
    return this.projectId;
  }

  public set project(projectId: string) {
    this.projectId = projectId;
  }
}
