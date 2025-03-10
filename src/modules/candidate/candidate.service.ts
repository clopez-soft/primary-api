import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, In } from "typeorm";
import { CandidateEntity } from "src/entities/candidate.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { ELECTORAL_LEVEL } from "src/common/enums";

//import { RedisCacheService } from 'src/modules/cache/redis-cache.service';
//import { PoliticPartyService } from 'src/modules/politic-party/politic-party.service';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepo: Repository<CandidateEntity>,
    //private readonly cache: RedisCacheService,
    //private readonly politicPartyService: PoliticPartyService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  //   private clearCache() {
  //     this.cache.clearByResolver('politicparty');
  //   }

  findAll(ssn: SessionDto, relations: string[] = []) {
    const where: FindOptionsWhere<CandidateEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("candidate").granted)
      where.created_by = ssn.id;

    return this.candidateRepo.find({
      where,
      order: { box_number: "ASC" },
      relations: relations,
    });
  }

  findById(
    id: string,
    relations: string[] = [
      "movimiento_interno",
      "country",
      "department",
      "municipality",
      "political_alliance",
    ]
  ) {
    return this.candidateRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findByIds(ids: string[], relations: string[] = []) {
    return this.candidateRepo.find({
      where: { id: In(ids), active: true },
      relations: relations,
      order: { box_number: "ASC" },
    });
  }

  findByElectoralLevel(
    level: ELECTORAL_LEVEL,
    relations: string[] = [
      "movimiento_interno",
      "country",
      "department",
      "municipality",
      "political_alliance",
    ]
  ) {
    return (
      this.candidateRepo.find({
        where: { level: level, active: true },
        relations: relations,
        order: { box_number: "ASC" },
      }) || []
    );
  }

  findByPartyAndLevel(movimiento_interno_id: string, level: ELECTORAL_LEVEL) {
    const res = this.candidateRepo
      .createQueryBuilder("candidate")
      .leftJoinAndSelect("candidate.movimiento_interno", "movimiento_interno");

    switch (level) {
      case ELECTORAL_LEVEL.PRESIDENT:
        res.leftJoinAndSelect("candidate.country", "country");
        break;
      case ELECTORAL_LEVEL.CONGRESS:
        res.leftJoinAndSelect("candidate.department", "department");
        break;
      case ELECTORAL_LEVEL.MAYOR:
        res.leftJoinAndSelect("candidate.municipality", "municipality");
        break;
      default:
        break;
    }

    res
      .where("candidate.movimiento_interno_id = :movimiento_interno_id")
      .andWhere("candidate.level = :level")
      .setParameters({
        movimiento_interno_id: movimiento_interno_id,
        level: level,
      })
      .orderBy({ box_number: "ASC" });

    return res.getMany();
  }

  findByAllianceAndLevel(
    political_alliance_id: string,
    level: ELECTORAL_LEVEL
  ) {
    const res = this.candidateRepo
      .createQueryBuilder("candidate")
      .leftJoinAndSelect("candidate.political_alliance", "political_alliance");

    switch (level) {
      case ELECTORAL_LEVEL.PRESIDENT:
        res.leftJoinAndSelect("candidate.country", "country");
        break;
      case ELECTORAL_LEVEL.CONGRESS:
        res.leftJoinAndSelect("candidate.department", "department");
        break;
      case ELECTORAL_LEVEL.MAYOR:
        res.leftJoinAndSelect("candidate.municipality", "municipality");
        break;
      default:
        break;
    }

    res
      .where("candidate.political_alliance_id = :political_alliance_id")
      .andWhere("candidate.level = :level")
      .setParameters({
        political_alliance_id: political_alliance_id,
        level: level,
      })
      .orderBy({ box_number: "ASC" });

    return res.getMany();
  }

  findByMunicipality(municipality_id: string) {
    const res = this.candidateRepo
      .createQueryBuilder("candidate")
      .leftJoinAndSelect("candidate.movimiento_interno", "movimiento_interno")
      .leftJoinAndSelect("candidate.political_alliance", "political_alliance")
      .leftJoinAndSelect("candidate.municipality", "municipality");

    res
      .where("candidate.political_alliance_id = :political_alliance_id")
      .andWhere("candidate.level = :level")
      .setParameters({
        municipality_id: municipality_id,
        level: ELECTORAL_LEVEL.MAYOR,
      })
      .orderBy({ box_number: "ASC" });

    return res.getMany();
  }
}
