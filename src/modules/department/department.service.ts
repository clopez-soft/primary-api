import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { DepartmentEntity } from "src/entities/locations/department.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { CountryService } from "src/modules/country/country.service";

import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "./dto/department.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly deparmentRepo: Repository<DepartmentEntity>,
    // private readonly cache: RedisCacheService,
    private readonly countryService: CountryService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("department");
  }

  findAll(ssn: SessionDto, relations: string[] = ["country"]) {
    const where: FindOptionsWhere<DepartmentEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("department").granted)
      where.created_by = ssn.id;

    return this.deparmentRepo.find({
      where,
      order: { name: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = ["country"]) {
    return this.deparmentRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findBySlug(slug: string, relations: string[] = ["country"]) {
    return this.deparmentRepo.findOne({
      where: { slug: slug, active: true },
      relations: relations,
    });
  }

  private findByCode(code: string, relations: string[] = []) {
    return this.deparmentRepo.findOne({
      where: { code: code, active: true },
      relations: relations,
    });
  }

  private findByName(name: string, relations: string[] = []) {
    return this.deparmentRepo.findOne({
      where: { name: name, active: true },
      relations: relations,
    });
  }

  async create(input: CreateDepartmentInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbCountry] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.countryService.findById(input.country_id),
    ]);

    if (existingName)
      throw new CustomException(null, "Name already exists", true);

    if (existingCode)
      throw new CustomException(null, "Code already exists", true);

    if (!dbCountry) throw new CustomException(null, "Country not exists", true);

    const item = this.deparmentRepo.create(input);
    item.created_by = ssn.id;
    item.country = dbCountry;

    this.clearCache();

    return this.deparmentRepo.save(item);
  }

  async update(input: UpdateDepartmentInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbCountry, item] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.countryService.findById(input.country_id),
      this.findById(input.department_id, []),
    ]);

    if (existingName && existingName.id !== input.department_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    if (existingCode && existingCode.id !== input.department_id)
      throw new CustomException(
        null,
        "The code is already in use by another record.",
        true
      );

    if (!dbCountry) throw new CustomException(null, "Country not exists", true);

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.deparmentRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();
    itemToSave.country = dbCountry;

    this.clearCache();

    return this.deparmentRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.deparmentRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
