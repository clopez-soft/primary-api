import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, In } from "typeorm";
import { JrvEntity } from "src/entities/jrv/jrv.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
//import { ELECTORAL_LEVEL } from 'src/common/enums';

//import { RedisCacheService } from 'src/modules/cache/redis-cache.service';
//import { PoliticPartyService } from 'src/modules/politic-party/politic-party.service';

import { Get_JRV_Info } from "./query";
import { JRV_InfoDTO } from "./dto/jrv.input";

@Injectable()
export class JrvService {
  constructor(
    @InjectRepository(JrvEntity)
    private readonly jrvRepo: Repository<JrvEntity>,
    //private readonly cache: RedisCacheService,
    //private readonly politicPartyService: PoliticPartyService,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  //   private clearCache() {
  //     this.cache.clearByResolver('politicparty');
  //   }

  findAll(ssn: SessionDto, relations: string[] = []) {
    const where: FindOptionsWhere<JrvEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("jrv").granted)
      where.created_by = ssn.id;

    return this.jrvRepo.find({
      where,
      order: { number: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = ["voting_center"]) {
    return this.jrvRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findByIds(ids: string[], relations: string[] = ["voting_center"]) {
    return this.jrvRepo.find({
      where: { id: In(ids), active: true },
      relations: relations,
      order: { number: "ASC" },
    });
  }

  async findByNumber(number: number): Promise<JRV_InfoDTO[]> {
    const query = Get_JRV_Info(number || 0);
    //console.info({ number });

    const manager = this.jrvRepo.manager;
    const output = await manager.query(query);

    //console.info(output);

    if (output?.length > 0) {
      return output?.map((item: any) => {
        return {
          id: item?.id || "",
          name: item?.name || "",
          number: item?.number || 0,
          electoral_weight: item?.electoral_weight || 0,
          country: {
            id: item?.countryid || "",
            code: item?.countrycode || "",
            name: item?.countryname || "",
          },
          department: {
            id: item?.deparmentid || "",
            code: item?.deparmentcode || "",
            name: item?.deparmentname || "",
          },
          municipality: {
            id: item?.municipalityid || "",
            code: item?.municipalitycode || "",
            name: item?.municipalityname || "",
          },
          voting_center: {
            id: item?.votingcenterid || "",
            code: item?.votingcentercode || "",
            name: item?.votingcentername || "",
            electoral_sector: item?.electoral_sector || "",
            area: item?.area || "",
          },
        } as JRV_InfoDTO;
      });
    }

    return [];
  }

  findByVotingCenter(
    voting_center_id: string,
    relations: string[] = ["voting_center"]
  ) {
    return (
      this.jrvRepo.find({
        where: { voting_center: { id: voting_center_id }, active: true },
        relations: relations,
      }) || []
    );
  }
}
