import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { DepartmentService } from "src/modules/department/department.service";

import {
  CreateMunicipalityInput,
  UpdateMunicipalityInput,
} from "./dto/municipality.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectRepository(MunicipalityEntity)
    private readonly municipalityRepo: Repository<MunicipalityEntity>,
    // private readonly cache: RedisCacheService,
    private readonly departmentService: DepartmentService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("municipality");
  }

  findAll(ssn: SessionDto, relations: string[] = ["department"]) {
    const where: FindOptionsWhere<MunicipalityEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("municipality").granted)
      where.created_by = ssn.id;

    return this.municipalityRepo.find({
      where,
      order: { code: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = ["department"]) {
    return this.municipalityRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findBySlug(slug: string, relations: string[] = ["department"]) {
    return this.municipalityRepo.findOne({
      where: { slug: slug, active: true },
      relations: relations,
    });
  }

  private findByCode(code: string, relations: string[] = []) {
    return this.municipalityRepo.findOne({
      where: { code: code, active: true },
      relations: relations,
    });
  }

  private findByName(name: string, relations: string[] = []) {
    return this.municipalityRepo.findOne({
      where: { name: name, active: true },
      relations: relations,
    });
  }

  async create(input: CreateMunicipalityInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbDepartment] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.departmentService.findById(input.department_id),
    ]);

    if (existingName)
      throw new CustomException(null, "Name already exists", true);

    if (existingCode)
      throw new CustomException(null, "Code already exists", true);

    if (!dbDepartment)
      throw new CustomException(null, "Department not exists", true);

    const item = this.municipalityRepo.create(input);
    item.created_by = ssn.id;
    item.department = dbDepartment;

    this.clearCache();

    return this.municipalityRepo.save(item);
  }

  async update(input: UpdateMunicipalityInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbDepartment, item] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.departmentService.findById(input.department_id),
      this.findById(input.municipality_id, []),
    ]);

    if (existingName && existingName.id !== input.municipality_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    if (existingCode && existingCode.id !== input.municipality_id)
      throw new CustomException(
        null,
        "The code is already in use by another record.",
        true
      );

    if (!dbDepartment)
      throw new CustomException(null, "Department not exists", true);

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.municipalityRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();
    itemToSave.department = dbDepartment;

    this.clearCache();

    return this.municipalityRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.municipalityRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
