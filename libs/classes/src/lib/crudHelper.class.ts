import { Logger } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

export class CrudHelper {
  protected DoesNotExistException: any;
  protected name: string;

  constructor(
    name: string,
    doesNotExistException: any,
    public repository: Repository<any>
  ) {
    this.name = name;
    this.DoesNotExistException = doesNotExistException;
  }

  public async findOne(id: string) {
    // attempt to locate entity by id
    const entity = await this.repository.findOne(id);

    if (!entity) {
      // throw an error if entity was not found
      throw new this.DoesNotExistException();
    }

    // return found entity
    return entity;
  }

  // TODO: Define query explicitly
  public async find(
    pagination: IPaginationOptions,
    query?: any,
    reverseOrder?: boolean
  ) {
    return await paginate<any>(this.repository, pagination, {
      order: { createdAt: reverseOrder ? 'ASC' : 'DESC' },
      where: { ...query },
    });

    // return await this.repository.find({ ...query });
  }

  public async create(dto: any) {
    // create new entity object
    const newEntityToBeinserted = this.repository.create();

    // assign dto values to model
    for (const key of Object.keys(dto)) {
      newEntityToBeinserted[key] = dto[key];
    }

    Logger.log(JSON.stringify(newEntityToBeinserted));

    // save entity in database
    return await this.repository.save(newEntityToBeinserted);
  }

  public async update(id: string, body: any) {
    // get entity by id
    const entity = await this.repository.findOne(id);

    if (!entity) {
      // throw an error if entity was not found
      throw new this.DoesNotExistException();
    }

    // assign dto values to model
    for (const key of Object.keys(body)) {
      entity[key] = body[key];
    }

    // update model
    return await this.repository.save(entity);
  }

  public async delete(id: string) {
    // check if entity exists
    const entity = await this.findOne(id);

    if (!entity) {
      throw new this.DoesNotExistException();
    }

    // delete entity
    await this.repository.softDelete(id);

    return `${this.name} with id ${id} has been deleted`;
  }
}
