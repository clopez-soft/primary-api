import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { CountryEntity } from "src/entities/locations/country.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { CreateCountryInput, UpdateCountryInput } from "./dto/county.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepo: Repository<CountryEntity>,
    // private readonly cache: RedisCacheService,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("country");
  }

  findAll(ssn: SessionDto) {
    const where: FindOptionsWhere<CountryEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("country").granted)
      where.created_by = ssn.id;

    return this.countryRepo.find({ where, order: { name: "ASC" } });
  }

  findById(id: string) {
    return this.countryRepo.findOne({ where: { id, active: true } });
  }

  findBySlug(slug: string) {
    return this.countryRepo.findOne({ where: { slug: slug, active: true } });
  }

  findByCode(code: string) {
    return this.countryRepo.findOne({ where: { code: code, active: true } });
  }

  findByName(name: string) {
    return this.countryRepo.findOne({ where: { name: name, active: true } });
  }

  async create(input: CreateCountryInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
    ]);

    if (existingName)
      throw new CustomException(null, "Country name already exists", true);

    if (existingCode)
      throw new CustomException(null, "Country code already exists", true);

    const item = this.countryRepo.create(input);
    item.created_by = ssn.id;

    this.clearCache();

    return this.countryRepo.save(item);
  }

  async update(input: UpdateCountryInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, item] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.findById(input.country_id),
    ]);

    if (existingName && existingName.id !== input.country_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    if (existingCode && existingCode.id !== input.country_id)
      throw new CustomException(
        null,
        "The code is already in use by another record.",
        true
      );

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.countryRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();

    this.clearCache();

    return this.countryRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.countryRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
