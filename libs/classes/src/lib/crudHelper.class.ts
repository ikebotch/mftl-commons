import { Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository, SelectQueryBuilder } from 'typeorm';

export class CrudHelper<T = any> {
  // protected DoesNotExistException: any;
  // protected name: string;

  constructor(
    protected name: string,
    protected DoesNotExistException: any,
    public repository: Repository<T>
  ) {
    // this.name = name;
    // this.DoesNotExistException = doesNotExistException;
  }

  public async findOne(id: string, partition?: any) {
    // attempt to locate entity by id
    const entity = await this.repository.findOne({
      where: { id, ...partition },
    });

    if (!entity) {
      // throw an error if entity was not found
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // return found entity
    return entity;
  }

  public async search(
    query: SelectQueryBuilder<any>,
    pagination: IPaginationOptions
  ) {
    return await paginate<any>(query, pagination);
  }

  // TODO: Define query explicitly
  public async find(
    pagination: IPaginationOptions,
    query?: any,
    reverseOrder?: boolean,
    partition?: any
  ) {
    return await paginate<any>(this.repository, pagination, {
      order: { createdAt: reverseOrder ? 'ASC' : 'DESC' },
      where: { ...query, ...partition },
    });

    // return await this.repository.find({ ...query });
  }

  public async create(dto: any, partition?: any) {
    // create new entity object
    const newEntityToBeinserted: any = this.repository.create();

    // assign dto values to model
    for (const key of Object.keys(dto)) {
      newEntityToBeinserted[key] = dto[key];
    }

    Logger.log(JSON.stringify(newEntityToBeinserted));

    // save entity in database
    return await this.repository.save({
      ...newEntityToBeinserted,
      ...partition,
    });
  }

  public async getCreateEntityData(dto: any) {
    // create new entity object
    const newEntityToBeinserted: any = this.repository.create();

    // assign dto values to model
    for (const key of Object.keys(dto)) {
      newEntityToBeinserted[key] = dto[key];
    }

    // save entity in database
    return newEntityToBeinserted;
  }

  public async update(id: string, body: any, partition?: any) {
    // get entity by id
    const entity: any = await this.repository.findOne({ id, ...partition });

    if (!entity) {
      // throw an error if entity was not found
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // assign dto values to model
    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'boolean' || typeof body[key] === 'number') {
        entity[key] = body[key] ?? entity[key];
      } else {
        entity[key] = body[key] || entity[key];
      }
    }

    // update model
    return await this.repository.save(entity);
  }

  public async getUpdateEntityData(id: string, body: any) {
    // get entity by id
    const entity: any = await this.repository.findOne({ where: { id } });

    if (!entity) {
      // throw an error if entity was not found
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // assign dto values to model
    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'boolean' || typeof body[key] === 'number') {
        entity[key] = body[key] ?? entity[key];
      } else {
        entity[key] = body[key] || entity[key];
      }
    }

    // update model
    return entity;
  }

  public async getUpdateEntityWithInitialData(id: string, body: any) {
    // get entity by id
    // const originalData = {...body}
    const entity: any = await this.repository.findOne({ where: { id } });
    const initialEntity = { ...entity };

    if (!entity) {
      // throw an error if entity was not found
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // assign dto values to model
    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'boolean' || typeof body[key] === 'number') {
        entity[key] = body[key] ?? entity[key];
      } else {
        entity[key] = body[key] || entity[key];
      }
    }

    // update model
    return { updatedEntity: entity, initialEntity };
  }

  public async delete(id: string, partition?: any) {
    // check if entity exists
    const entity = await this.findOne(id, { ...partition });

    if (!entity) {
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // delete entity
    await this.repository.softDelete(id);

    return `${this.name} with id ${id} has been deleted`;
  }

  public async getDeleteEntityData(id: string) {
    // check if entity exists
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(`${this.name} does not exist`);
    }

    // delete entity
    return entity;
  }
}
