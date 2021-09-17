/* eslint-disable @typescript-eslint/no-namespace */
export namespace IamInterfaces {
  export interface AuthenticationToken {
    uid: string;
    iss: string;
    sid: string;
    pid: string;
    ctx: string[];
    iat: number;
    exp: number;
  }
}
