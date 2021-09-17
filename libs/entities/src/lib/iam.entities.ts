/* eslint-disable @typescript-eslint/no-namespace */
import { Logger } from '@nestjs/common';
import { hash } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as uniqid from 'uniqid';
import { BaseEntity } from './base.entity';

export namespace IamEntities {
  @Entity({ name: 'platform_users' })
  export class PlatformUserEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    firstname: string;

    @Column({ type: 'varchar', nullable: true })
    othernames: string;

    @Column({ type: 'varchar', nullable: true })
    lastname: string;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', nullable: true })
    gender: string;

    @Column({ type: 'varchar', nullable: true })
    birthdate: string;

    @OneToOne(() => PlatformAccountEntity)
    account: any;
  }

  @Entity({ name: 'platform_accounts' })
  export class PlatformAccountEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: true })
    username: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    preferredUsername: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @OneToOne(() => PlatformUserEntity, {
      eager: true,
      cascade: true,
    })
    @JoinColumn()
    profile: any;

    @BeforeInsert()
    async beforeAccountInsert() {
      Logger.log('Hashing password', 'PlatformAccountEntity');

      // hash password
      this.password = await hash(this.password, 10);

      // generate prefered username
      this.preferredUsername = `account-${uniqid()}`;
    }
  }

  @Entity({ name: 'roles' })
  export class RoleEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @ManyToMany(() => PrivilegeEntity, {
      cascade: true,
      eager: true,
    })
    @JoinTable({ name: 'role_privileges' })
    privileges: any[];

    @OneToMany(() => PlatformProjectEntity, (project) => project.defaultRole)
    platformProjectDefaultRoles: any[];

    @OneToMany(
      () => PlatformProjectEntity,
      (project) => project.defaultClientRole
    )
    platformProjectDefaultClientRoles: any[];

    @ManyToMany(() => PlatformProjectEntity, (project) => project.roles)
    platformProjectRoles: any[];
  }

  @Entity({ name: 'privileges' })
  export class PrivilegeEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;
  }

  @Entity({ name: 'platform_clients' })
  export class ClientEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    alias: string;

    @Column({ type: 'varchar', nullable: false })
    secret: string;

    @ManyToOne(() => PlatformProjectEntity, (project) => project.cleints, {
      eager: true,
    })
    @JoinColumn()
    project: any;
  }

  @Entity({ name: 'platform_projects' })
  export class PlatformProjectEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: false })
    alias: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => ClientEntity, (client) => client.project)
    cleints: any[];

    @ManyToOne(() => RoleEntity, (role) => role.platformProjectDefaultRoles, {
      eager: true,
    })
    defaultRole: any;

    @ManyToOne(() => RoleEntity, (role) => role.platformProjectDefaultRoles, {
      eager: true,
    })
    defaultClientRole: any;

    @ManyToMany(() => RoleEntity, (role) => role.platformProjectRoles, {
      eager: true,
    })
    @JoinTable({ name: 'platform_project_roles' })
    roles: any[];

    @BeforeInsert()
    createProjectCode() {
      this.code = `project-${uniqid()}`;
    }
  }

  @Entity({ name: 'sessions' })
  export class SessionEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: false })
    owner: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    token: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    tokenType: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    device: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    ipAddress: string;
  }

  @Entity({ name: 'contexts' })
  export class ContextEntity extends BaseEntity {
    @ManyToOne(() => IamEntities.PlatformAccountEntity, {
      eager: true,
      cascade: false,
      nullable: true,
      createForeignKeyConstraints: false,
    })
    @JoinColumn()
    platformClient: any;

    @ManyToOne(() => IamEntities.PlatformAccountEntity, {
      eager: true,
      cascade: false,
      nullable: true,
      createForeignKeyConstraints: false,
    })
    @JoinColumn()
    platformAccount: any;

    @ManyToOne(() => IamEntities.RoleEntity, {
      eager: true,
      cascade: false,
      nullable: true,
      createForeignKeyConstraints: false,
    })
    @JoinColumn()
    role: any;

    @ManyToOne(() => IamEntities.PlatformProjectEntity, {
      eager: true,
      cascade: false,
      nullable: true,
      createForeignKeyConstraints: false,
    })
    @JoinColumn()
    project: any;
  }
}
