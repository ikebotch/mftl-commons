import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenancyService {
  private tenantId = '';

  public get tenancy(): string {
    return this.tenantId;
  }

  public set tenancy(tenantId: string) {
    this.tenantId = tenantId;
  }
}
