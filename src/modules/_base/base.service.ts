import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { BaseEntity } from "src/entities/base.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { CreateBaseInput, UpdateBaseInput } from "./base.input";

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(BaseEntity)
    private readonly baseRepo: Repository<BaseEntity>,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  findAll(ssn: SessionDto) {
    const where: FindOptionsWhere<BaseEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("base").granted)
      where.created_by = ssn.id;

    return this.baseRepo.find({ where, order: { name: "ASC" } });
  }

  findById(id: string) {
    return this.baseRepo.findOne({ where: { id, active: true } });
  }

  findBySlug(slug: string) {
    return this.baseRepo.findOne({ where: { slug: slug, active: true } });
  }

  findByName(name: string) {
    return this.baseRepo.findOne({ where: { name: name, active: true } });
  }

  async create(input: CreateBaseInput, ssn: SessionDto) {
    if (input.require && !input.name)
      throw new CustomException(null, "A name is required", true);

    const existing = await this.findByName(input.name);
    if (existing)
      throw new CustomException(null, "Base name already exists", true);

    const item = this.baseRepo.create(input);
    item.created_by = ssn.id;

    return this.baseRepo.save(item);
  }

  async update(input: UpdateBaseInput, ssn: SessionDto) {
    if (input.require && !input.name)
      throw new CustomException(null, "A name is required", true);

    const existing = await this.findByName(input.name);
    if (existing && existing.id !== input.base_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    const item = await this.findById(input.base_id);
    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.baseRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;

    return this.baseRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.baseRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    return [id];
  }
}
