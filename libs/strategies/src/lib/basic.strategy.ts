import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicStrategy as Strategy } from 'passport-http';
import { Repository } from 'typeorm';
import { IamEntities } from '@mftl/common-enums';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(IamEntities.ClientEntity)
    private repository: Repository<IamEntities.ClientEntity>
  ) {
    super();
  }

  async validate(username: string, password: string) {
    //check if this username exists
    const client = await this.repository.findOne(username);

    if (!client) {
      throw new UnauthorizedException();
    }

    // proceed to check password
    const passwordMatches = password === client.secret;

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    return client;
  }
}
