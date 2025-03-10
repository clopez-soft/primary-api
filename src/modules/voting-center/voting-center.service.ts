import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";

import { AREA_ELECTORAL_SECTOR } from "src/common/enums";
import { CustomException } from "src/custom/save-db.exception";
import { VotingCenterEntity } from "src/entities/locations/voting-center.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { MunicipalityService } from "src/modules/municipality/municipality.service";

import {
  CreateVotingCenterInput,
  UpdateVotingCenterInput,
} from "./dto/voting-center.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";

@Injectable()
export class VotingCenterService {
  constructor(
    @InjectRepository(VotingCenterEntity)
    private readonly votingcenterRepo: Repository<VotingCenterEntity>,
    // private readonly cache: RedisCacheService,
    private readonly municipalityService: MunicipalityService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("votingcenter");
  }

  findAll(ssn: SessionDto, relations: string[] = ["municipality"]) {
    const where: FindOptionsWhere<VotingCenterEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("voting-center").granted)
      where.created_by = ssn.id;

    return this.votingcenterRepo.find({
      where,
      order: { code: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = ["municipality"]) {
    return this.votingcenterRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findBySlug(slug: string, relations: string[] = ["municipality"]) {
    return this.votingcenterRepo.findOne({
      where: { slug: slug, active: true },
      relations: relations,
    });
  }

  findByMunicipality(
    municipality_id: string = "",
    areaType?: AREA_ELECTORAL_SECTOR
  ) {
    if (!municipality_id) return null;

    let where: FindOptionsWhere<VotingCenterEntity> = {
      municipality: { id: municipality_id },
      active: true,
    };
    if (areaType) {
      where.area = areaType;
    }

    return this.votingcenterRepo.find({
      where: where,
      order: { code: "ASC" },
      relations: ["municipality"],
    });
  }

  areaElectoralSector() {
    const arr = Object.values(AREA_ELECTORAL_SECTOR);
    return arr;
  }

  private findByCode(code: string, relations: string[] = []) {
    return this.votingcenterRepo.findOne({
      where: { code: code, active: true },
      relations: relations,
    });
  }

  private findByName(name: string, relations: string[] = []) {
    return this.votingcenterRepo.findOne({
      where: { name: name, active: true },
      relations: relations,
    });
  }

  async create(input: CreateVotingCenterInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbMunicipality] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.municipalityService.findById(input.municipality_id),
    ]);

    if (existingName)
      throw new CustomException(null, "Name already exists", true);

    if (existingCode)
      throw new CustomException(null, "Code already exists", true);

    if (!dbMunicipality)
      throw new CustomException(null, "Municipality not exists", true);

    const item = this.votingcenterRepo.create(input);
    item.created_by = ssn.id;
    item.municipality = dbMunicipality;

    this.clearCache();

    return this.votingcenterRepo.save(item);
  }

  async update(input: UpdateVotingCenterInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, dbMunicipality, item] =
      await Promise.all([
        this.findByName(input.name),
        this.findByCode(input.code),
        this.municipalityService.findById(input.municipality_id),
        this.findById(input.voting_center_id, []),
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

    if (!dbMunicipality)
      throw new CustomException(null, "Municipality not exists", true);

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    const itemToSave = this.votingcenterRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();
    itemToSave.municipality = dbMunicipality;

    this.clearCache();

    return this.votingcenterRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.votingcenterRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
