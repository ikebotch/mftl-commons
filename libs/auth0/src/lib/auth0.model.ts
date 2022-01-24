export interface Auth0ValidatePayloadModel {
  [id: string]: any;
  userInfo?: any;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
}

export interface Auth0ConfigModel {
  audience: string;
  issuerUrl: string;
  domain: string;
  clientId: string;
  clientSecret: string;
  managementApiAudience: string;
}
