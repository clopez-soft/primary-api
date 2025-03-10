import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, In } from "typeorm";

import { CustomException } from "src/custom/save-db.exception";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { ELECTORAL_LEVEL } from "src/common/enums";

import {
  CreatePoliticalAllianceInput,
  UpdatePoliticalAllianceInput,
} from "./dto/political-alliance.input";

// import { RedisCacheService } from "src/modules/cache/redis-cache.service";
import { MovimientoInternoService } from "src/modules/movimiento-interno/movimiento-interno.service";

@Injectable()
export class PoliticalAllianceService {
  constructor(
    @InjectRepository(PoliticalAllianceEntity)
    private readonly politicalAllianceRepo: Repository<PoliticalAllianceEntity>,
    // private readonly cache: RedisCacheService,
    private readonly politicPartyService: MovimientoInternoService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private clearCache() {
    // this.cache.clearByResolver("politicparty");
  }

  findAll(ssn: SessionDto, relations: string[] = []) {
    const where: FindOptionsWhere<PoliticalAllianceEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("political-alliance").granted)
      where.created_by = ssn.id;

    return this.politicalAllianceRepo.find({
      where,
      order: { name: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = []) {
    return this.politicalAllianceRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findBySlug(slug: string, relations: string[] = []) {
    return this.politicalAllianceRepo.findOne({
      where: { slug: slug, active: true },
      relations: relations,
    });
  }

  findByCode(code: string, relations: string[] = []) {
    return this.politicalAllianceRepo.findOne({
      where: { code: code, active: true },
      relations: relations,
    });
  }

  findByIds(ids: string[], relations: string[] = []) {
    return this.politicalAllianceRepo.find({
      where: { id: In(ids), active: true },
      relations,
    });
  }

  findByElectoralLevel(level: ELECTORAL_LEVEL, relations: string[] = []) {
    return (
      this.politicalAllianceRepo.find({
        where: { level: level, active: true },
        relations: relations,
      }) || []
    );
  }

  private findByName(name: string, relations: string[] = []) {
    return this.politicalAllianceRepo.findOne({
      where: { name: name, active: true },
      relations: relations,
    });
  }

  async create(input: CreatePoliticalAllianceInput, ssn: SessionDto) {
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

    if (input.politic_parties) {
      for (const partyCode of input.politic_parties) {
        const existParty = await this.politicPartyService.findByCode(partyCode);
        if (!existParty) {
          throw new CustomException(
            null,
            `Not exists politic party ${partyCode}`,
            true
          );
        }
      }
    }

    const item = this.politicalAllianceRepo.create(input);
    item.created_by = ssn.id;

    this.clearCache();

    return this.politicalAllianceRepo.save(item);
  }

  async update(input: UpdatePoliticalAllianceInput, ssn: SessionDto) {
    if (!input.name)
      throw new CustomException(null, "A name is required", true);

    const [existingName, existingCode, item] = await Promise.all([
      this.findByName(input.name),
      this.findByCode(input.code),
      this.findById(input.political_alliance_id, []),
    ]);

    if (existingName && existingName.id !== input.political_alliance_id)
      throw new CustomException(
        null,
        "The name is already in use by another record.",
        true
      );

    if (existingCode && existingCode.id !== input.political_alliance_id)
      throw new CustomException(
        null,
        "The code is already in use by another record.",
        true
      );

    if (!item) {
      throw new CustomException(null, "Record not found", true);
    }

    if (input.politic_parties) {
      for (const partyCode of input.politic_parties) {
        const existParty = await this.politicPartyService.findByCode(partyCode);
        if (!existParty) {
          throw new CustomException(
            null,
            `Not exists politic party ${partyCode}`,
            true
          );
        }
      }
    }

    const itemToSave = this.politicalAllianceRepo.merge(item, input);
    itemToSave.updated_by = ssn.id;
    itemToSave.updated_at = new Date();

    this.clearCache();

    return this.politicalAllianceRepo.save(itemToSave);
  }

  async remove(id: string, ssn: SessionDto) {
    const result = await this.politicalAllianceRepo.update(
      { id: id, active: true },
      { active: false, deleted_by: ssn.id, deleted_at: new Date() }
    );

    if ((result.affected || 0) <= 0)
      throw new CustomException(null, "Could not remove record.", true);

    this.clearCache();
    return [id];
  }
}
