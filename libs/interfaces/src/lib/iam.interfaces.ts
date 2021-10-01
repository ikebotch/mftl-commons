/* eslint-disable @typescript-eslint/no-namespace */
export namespace IamInterfaces {

  export type GrantType = 'client-credentials' | 'password' | 'refresh-token'
  export interface AuthenticationToken {
    uid: string;
    iss: string;
    sid: string;
    pid: string;
    ctx: string[];
    iat: number;
    exp: number;
  }

  export interface AuthenticationCredential {
      identifier: string;
      password: string;
      grant_type: GrantType;
  }

  export interface AuthenticationResponseData {
    token: string;
    refreshToken: string;
    createdAt: Date;
    expiry: Date;
}
}
