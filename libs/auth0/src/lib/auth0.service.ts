import { Inject, Injectable } from '@nestjs/common';
import {
  AppMetadata,
  AuthenticationClient,
  ManagementClient,
  ManagementClientOptions,
  UserMetadata,
} from 'auth0';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, switchMap, tap } from 'rxjs';
import { AUTH0_CONFIG } from './auth0.config';
import { Auth0ConfigModel } from './auth0.model';

@Injectable()
export class Auth0Service {
  #url!: string;
  management: ManagementClient<AppMetadata, UserMetadata>;
  auth: AuthenticationClient;
  constructor(private httpService: HttpService, @Inject(AUTH0_CONFIG) private auth0Config: Auth0ConfigModel) {
     const { domain, clientId, clientSecret, managementApiAudience, issuerUrl} = this.auth0Config
    const managementOptions: ManagementClientOptions = {
      domain,
      clientId,
      clientSecret,
      audience: managementApiAudience,
    };
    this.management = new ManagementClient(managementOptions);
    this.auth = new AuthenticationClient({
      domain,
      clientId,
      clientSecret,
    });

    this.#url = issuerUrl;
  }

  #getToken() {
    const { clientId, clientSecret, managementApiAudience } = this.auth0Config
    return this.httpService
      .post(this.#url + 'oauth/token', {
        client_id: clientId,
        client_secret: clientSecret,
        audience: managementApiAudience,
        grant_type: 'client_credentials',
      })
      .pipe(map((data) => data.data));
  }

  async getUsers() {
    return await lastValueFrom(
      this.#getToken().pipe(
        switchMap((token) =>
          this.httpService.get(this.#url + 'api/v2/users', {
            headers: {
              'authorization': `${token.token_type} ${token.access_token}`,
            },
          }).pipe(tap({error: (err) => console.dir({err: err?.response}, {depth: 2})})),
        ),
        map((data) => data.data),
      ),
    );
  }

  async getUser(id: string) {
    return await lastValueFrom(
      this.#getToken().pipe(
        switchMap((token) =>
          this.httpService.get(this.#url + 'api/v2/users/' + id, {
            headers: {
              'authorization': `${token.token_type} ${token.access_token}`,
            },
          }).pipe(tap({error: (err) => console.dir({err: err?.response}, {depth: 2})})),
        ),
        map((data) => data.data),
      ),
    );
  }

  async updateUser(id: string, body: any) {
    return await lastValueFrom(
      this.#getToken().pipe(
        switchMap((token) =>
          this.httpService.patch(this.#url + 'api/v2/users/' + id, body, {
            headers: {
              'authorization': `${token.token_type} ${token.access_token}`,
            },
          }).pipe(tap({error: (err) => console.dir({err: err?.response}, {depth: 2})})),
        ),
        map((data) => data.data),
      ),
    );
  }
}
