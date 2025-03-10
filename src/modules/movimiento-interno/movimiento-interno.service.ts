import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, In } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";

import {
  CreateMovimientoInternoInput,
  UpdateMovimientoInternoInput,
} from "./dto/movimiento-interno.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";

@Injectable()
export class MovimientoInternoService {
  constructor(
    @InjectRepository(MovimientoInternoEntity)
    private readonly movimientoInternoRepo: Repository<MovimientoInternoEntity>,
    // private readonly cache: RedisCacheService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("politicparty");
  }

  findAll(ssn: SessionDto, relations: string[] = []) {
    const where: FindOptionsWhere<MovimientoInternoEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("politic-party").granted)
      where.created_by = ssn.id;

    return this.movimientoInternoRepo.find({
      where,
      order: { name: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = []) {
    return this.movimientoInternoRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findBySlug(slug: string, relations: string[] = []) {
    return this.movimientoInternoRepo.findOne({
      where: { slug: slug, active: true },
      relations: relations,
    });
  }

  findByCode(code: string, relations: string[] = []) {
    return this.movimientoInternoRepo.findOne({
      where: { code: code, active: true },
      relations: relations,
    });
  }

  findByIds(ids: string[], relations: string[] = []) {
    return this.movimientoInternoRepo.find({
      where: { id: In(ids), active: true },
      relations,
    });
  }

  private findByName(name: string, relations: string[] = []) {
    return this.movimientoInternoRepo.findOne({
      where: { name: name, active: true },
      relations: relations,
    });
  }

  async create(input: CreateMovimientoInternoInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
    ]);

    if (existingName)
      throw new CustomException(null, "Name already exists", true);

    if (existingCode)
      throw new CustomException(null, "Code already exists", true);

    const item = this.movimientoInternoRepo.create(input);
    item.created_by = ssn.id;

    this.clearCache();

    return this.movimientoInternoRepo.save(item);
  }

  async update(input: UpdateMovimientoInternoInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, item] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.findById(input.movimiento_interno_id, []),
    ]);

    if (existingName && existingName.id !== input.movimiento_interno_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    if (existingCode && existingCode.id !== input.movimiento_interno_id)
      throw new CustomException(
        null,
        "The code is already in use by another record.",
        true
      );

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.movimientoInternoRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();

    this.clearCache();

    return this.movimientoInternoRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.movimientoInternoRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
