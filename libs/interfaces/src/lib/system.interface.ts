/* eslint-disable @typescript-eslint/no-namespace */
export namespace SystemInterfaces {

  export type IdentifierType = 'email' | 'tel' | 'text'
  export interface Identifier {
    type: IdentifierType
    label: string
    loginSubmitLabel: string;
    registerSubmitLabel: string;
    otpType?: string
    requiresOtp: boolean;
  }
  export interface SessionInterface {
    projectId: string;
    tenantId: string;
  }

  export interface ApiResponse<T> {
    statusCode: number;
    data: T;
  }
  export interface Environment {
    production: boolean;
    baseUrl: {[id: string]: string};
    client_id: string;
    client_secret: string;
    identifier: Identifier;
    loginUrl: string;
    registerUrl: string;
    redirectUrl: string;
    homeUrl: string;
  }
}
