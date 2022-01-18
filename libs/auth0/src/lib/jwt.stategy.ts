import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH0_CONFIG } from './auth0.config';
import { Auth0ConfigModel, Auth0ValidatePayloadModel } from './auth0.model';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH0_CONFIG) private auth0Config: Auth0ConfigModel ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth0Config.issuerUrl}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${auth0Config.audience}`,
      issuer: `${auth0Config.issuerUrl}`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: Auth0ValidatePayloadModel): any {
    const userInfo = {
      ...(payload[`${this.auth0Config.audience}/user-metadata`] || {}),
    };
    delete payload[`${this.auth0Config.audience}/user-metadata`];
    // console.dir({...payload, userInfo});
    return { ...payload, userInfo };
  }
}
