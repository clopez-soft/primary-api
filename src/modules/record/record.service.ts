import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, DataSource, In } from "typeorm";
// import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

import { RecordEntity } from "src/entities/record/record.entity";
import { RecordDetailEntity } from "src/entities/record/record-detail.entity";
import {
  RolesBuilder,
  InjectRolesBuilder,
} from "src/modules/authorization/ac-options";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { ELECTORAL_LEVEL } from "src/common/enums";

//import { RedisCacheService } from 'src/modules/cache/redis-cache.service';
import { MovimientoInternoService } from "src/modules/movimiento-interno/movimiento-interno.service";
import { PoliticalAllianceService } from "src/modules/political-alliance/political-alliance.service";
import { CandidateService } from "src/modules/candidate/candidate.service";
import { JrvService } from "src/modules/jrv/jrv.service";
// import { FilesService } from "src/modules/file/files.service";

import {
  // convertFileIntoBuffer,
  getFolderFile,
  toSafeNumber,
} from "src/helper/util";
import { CustomException } from "src/custom/save-db.exception";

import { CreateRecordInput, UpdateRecordInput } from "./dto/record.input";

import {
  RecordDetailDto,
  QuotientPartyDto,
  CandidateCongressDto,
  ResultsCongressDto,
  PartyMayorMarkDto,
  ResultsMayorDto,
  PartyMayorPositionDto,
  PresidentVotesDto,
  ResultsPresidentDto,
} from "./dto/record.dto";

import {
  TotalMarkCongress,
  TotalMarkCongressByParty,
  TotalMarkCongressByCandidate,
  TotalMarkMayor,
  TotalMarkMayorByParty,
  PresidentVotes,
  CountRecordMayor,
  CountRecordCongress,
  PresidentCountRecord,
  PresidentTotalVotes,
} from "./query";

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepo: Repository<RecordEntity>,

    @InjectRepository(RecordDetailEntity)
    private readonly recordDetailRepo: Repository<RecordDetailEntity>,

    //private readonly cache: RedisCacheService,
    // private readonly filesService: FilesService,
    private readonly politicPartyService: MovimientoInternoService,
    private readonly politicalAllianceService: PoliticalAllianceService,
    private readonly candidateService: CandidateService,
    private readonly jrvService: JrvService,

    private readonly dataSource: DataSource,

    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  electoralLevels() {
    const arr = Object.values(ELECTORAL_LEVEL);
    return arr;
  }

  findAll(ssn: SessionDto, relations: string[] = []) {
    this.getMayorResult("");
    const where: FindOptionsWhere<RecordEntity> = { active: true };
    if (!this.roleBuilder.can(ssn.role).readAny("record").granted)
      where.created_by = ssn.id;

    return this.recordRepo.find({
      where,
      order: { number: "ASC" },
      relations: relations,
    });
  }

  findById(id: string, relations: string[] = ["jrv"]) {
    return this.recordRepo.findOne({
      where: { id, active: true },
      relations: relations,
    });
  }

  findByIds(ids: string[], relations: string[] = ["jrv"]) {
    return this.recordRepo.find({
      where: { id: In(ids), active: true },
      relations,
      order: { number: "ASC" },
    });
  }

  async findDetailByRecordDto(id: string, includeRelations = false) {
    const query = this.recordDetailRepo
      .createQueryBuilder("detail_x_record")
      .leftJoinAndSelect(
        "detail_x_record.movimiento_interno",
        "movimiento_interno"
      )
      .leftJoinAndSelect(
        "detail_x_record.political_alliance",
        "political_alliance"
      )
      .leftJoinAndSelect("detail_x_record.candidate", "candidate")
      .where("detail_x_record.record_id = :record_id")
      .andWhere("detail_x_record.active = true")
      .setParameters({ record_id: id });

    if (includeRelations) {
      query.leftJoinAndSelect("detail_x_record.record", "record");
    }

    const res = await query.getMany();

    const detailDto: RecordDetailDto[] = res.map((item) => {
      return {
        detail_id: item?.id || "",
        record_id: item.record.id || "",
        number_box: item?.number_box || 0,
        votes: item.votes || 0,
        movimiento_interno: {
          movimiento_interno_id: item?.movimiento_interno?.id || "",
          movimiento_interno_name: item?.movimiento_interno?.name || "",
          movimiento_interno_code: item?.movimiento_interno?.code || "",
          movimiento_interno_image: item?.movimiento_interno?.image_url || "",
        },
        political_alliance: {
          political_alliance_id: item?.political_alliance?.id || "",
          political_alliance_name: item?.political_alliance?.name || "",
          political_alliance_code: item?.political_alliance?.code || "",
          political_alliance_image: item?.political_alliance?.image_url || "",
        },
        candidate: {
          candidate_id: item?.candidate?.id || "",
          candidate_name: item?.candidate?.name || "",
          candidate_box: item?.candidate?.box_number || 0,
          candidate_image: item?.candidate?.image_url || "",
        },
      };
    });
    return detailDto;
  }

  async findDetailByRecord(record_id: string) {
    const res = this.recordDetailRepo
      .createQueryBuilder("detail_x_record")
      .where("detail_x_record.record_id = :record_id")
      .andWhere("detail_x_record.active = true")
      .setParameters({ record_id: record_id });

    return res.getMany();
  }

  async findByNumberAndLevel(level: ELECTORAL_LEVEL, number: number) {
    const res = this.recordRepo
      .createQueryBuilder("record_jrv")
      .leftJoinAndSelect("record_jrv.jrv", "jrv")
      .where("jrv.number = :jrv_number")
      .andWhere("record_jrv.level = :record_level")
      .andWhere("record_jrv.active = true")
      .setParameters({ jrv_number: number, record_level: level });

    return res.getOne();
  }

  async getCongressResult(
    municipality_id?: string
  ): Promise<ResultsCongressDto> {
    //CountRecordCongress
    let formatMuniId = municipality_id;
    if (municipality_id) {
      formatMuniId = `'${municipality_id}'`;
    }
    const positions: number = 9;
    const manager = this.recordDetailRepo.manager;
    const [
      totalMarksCongress,
      partyMarks,
      candidateMarks,
      countRecordCongress,
    ] = await Promise.all([
      manager.query(TotalMarkCongress(formatMuniId)),
      manager.query(TotalMarkCongressByParty(formatMuniId)),
      manager.query(TotalMarkCongressByCandidate(formatMuniId)),
      manager.query(CountRecordCongress(formatMuniId)),
    ]);

    let totalMarks: number = 0;
    if (totalMarksCongress && totalMarksCongress.length > 0) {
      totalMarks = toSafeNumber(totalMarksCongress[0].totalmark);
    }

    let countRecord: number = 0;
    if (countRecordCongress && countRecordCongress.length > 0) {
      countRecord = toSafeNumber(countRecordCongress[0].count_record);
    }

    const quotient: number = totalMarks / positions;
    const partyPositions: QuotientPartyDto[] = partyMarks?.map((item: any) => {
      const quotientParty = +item.totalmarkbyparty / quotient;
      const int_part = Math.trunc(quotientParty); // returns int
      const float_part = Number((quotientParty - int_part).toFixed(6)); // return decimals
      return {
        movimiento_interno_id: item.movimiento_interno_id || "",
        marks: +item.totalmarkbyparty,
        positions: int_part,
        quotient: float_part,
        positions_extra: 0,
      } as QuotientPartyDto;
    });

    const sortArray: QuotientPartyDto[] = partyPositions?.sort(function (a, b) {
      return b.quotient - a.quotient;
    });

    const totalPositionConfirm =
      sortArray
        .map((item) => item.positions)
        .reduce((prev, curr) => prev + curr, 0) || 0;
    const leaft_position = positions - totalPositionConfirm;
    const extraPosition = sortArray.slice(0, leaft_position);
    const partyPositionsWithExtra: QuotientPartyDto[] = partyPositions?.map(
      (item: QuotientPartyDto) => {
        let extra = 0;
        if (
          extraPosition.some(
            (d) => d.movimiento_interno_id === item?.movimiento_interno_id
          )
        )
          extra = 1;
        return {
          ...item,
          positions_extra: extra,
        } as QuotientPartyDto;
      }
    );

    const candidates: CandidateCongressDto[] = candidateMarks?.map(
      (item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",
          candidate_id: item.candidate_id || "",
          number_box: +item.number_box || 0,
          candidate_name: item.name || "",
          candidate_image: item.image_url || "",
          marks: +item.totalmarkbycandidate || 0,
        } as CandidateCongressDto;
      }
    );

    const sortArrayPosition: QuotientPartyDto[] = partyPositionsWithExtra?.sort(
      function (a, b) {
        return (
          b.positions + b.positions_extra - (a.positions + a.positions_extra)
        );
      }
    );

    const result: ResultsCongressDto = {
      count_record: countRecord,
      total_votes: totalMarks,
      positions_by_party: sortArrayPosition || [],
      candidate_congress: candidates || [],
    };
    return result;
  }

  async getMayorResult(
    municipality_id: string
  ): Promise<ResultsMayorDto | null> {
    if (municipality_id === "") {
      return null;
    }
    const positions: number = 11;
    const manager = this.recordDetailRepo.manager;
    const [totalMarksMayor, partyMarks, countRecordsMayor] = await Promise.all([
      manager.query(TotalMarkMayor(municipality_id)),
      manager.query(TotalMarkMayorByParty(municipality_id)),
      manager.query(CountRecordMayor(municipality_id)),
    ]);

    let totalMarks: number = 0;
    if (totalMarksMayor && totalMarksMayor.length > 0) {
      totalMarks = toSafeNumber(totalMarksMayor[0]?.totalmark);
    } else {
      return null;
    }

    let countRecords: number = 0;
    if (countRecordsMayor && countRecordsMayor.length > 0) {
      countRecords = toSafeNumber(countRecordsMayor[0]?.count_record);
    } else {
      return null;
    }

    if (!partyMarks) {
      return null;
    }

    if (partyMarks.length === 0) {
      return null;
    }
    const quotient: number = totalMarks / positions;
    const partyMark: PartyMayorMarkDto[] = partyMarks?.map((item: any) => {
      return {
        movimiento_interno_id: item.movimiento_interno_id || "",
        movimiento_interno_code: item.code || "",
        movimiento_interno_image: item.image_url || "",
        totalmark: +item.totalmark || 0,
      } as PartyMayorMarkDto;
    });

    const partyMarkResult: PartyMayorMarkDto[] = partyMarks?.map(
      (item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.code || "",
          movimiento_interno_image: item.image_url || "",
          totalmark: +item.totalmark || 0,
        } as PartyMayorMarkDto;
      }
    );

    let corporation: PartyMayorPositionDto[] = [];
    let index: number = 0;
    while (index < positions) {
      const sortArray = partyMark.sort(function (a, b) {
        return b.totalmark - a.totalmark;
      });
      sortArray[0].totalmark -= quotient;
      const newPosition: PartyMayorPositionDto = {
        movimiento_interno_id: sortArray[0]?.movimiento_interno_id || "",
        movimiento_interno_code: sortArray[0]?.movimiento_interno_code || "",
        movimiento_interno_image: sortArray[0]?.movimiento_interno_image || "",
        position: index,
      };
      corporation.push(newPosition);
      index++;
    }

    const sortCorporation = corporation.sort(function (a, b) {
      return a.position - b.position;
    });

    const result: ResultsMayorDto = {
      count_record: countRecords,
      total_votes: totalMarks,
      positions: sortCorporation || [],
      marks: partyMarkResult || [],
    };
    return result;
  }

  async getPresidentResult(): Promise<ResultsPresidentDto | null> {
    //PresidentCountRecord, PresidentTotalRecord
    const manager = this.recordDetailRepo.manager;
    const [presidentVotes, presidentCountRecord, presidentTotalVotes] =
      await Promise.all([
        manager.query(PresidentVotes),
        manager.query(PresidentCountRecord),
        manager.query(PresidentTotalVotes),
      ]);

    if (!presidentVotes) {
      return null;
    }

    if (presidentVotes.length === 0) {
      return null;
    }

    let totalVotes: number = 0;
    if (presidentTotalVotes && presidentTotalVotes.length > 0) {
      totalVotes = toSafeNumber(presidentTotalVotes[0]?.total_votes);
    } else {
      return null;
    }

    let countRecords: number = 0;
    if (presidentCountRecord && presidentCountRecord.length > 0) {
      countRecords = toSafeNumber(presidentCountRecord[0]?.count_record);
    } else {
      return null;
    }

    const president_votes: PresidentVotesDto[] = presidentVotes.map(
      (item: any) => {
        return {
          movimiento_interno_id: item.movimiento_interno_id || "",
          movimiento_interno_code: item.movimiento_interno_code || "",
          movimiento_interno_image: item.movimiento_interno_image || "",
          political_alliance_id: item.political_alliance_id || "",
          political_alliance_code: item.political_alliance_code || "",
          political_alliance_image: item.political_alliance_image || "",
          candidate_id: item.candidate_id || "",
          number_box: item.box_number || 0,
          candidate_name: item.candidate_name || "",
          candidate_image: item.candidate_image || "",
          candidate_flag: item.candidate_flag || "",
          votes: item.totalvotes || 0,
        } as PresidentVotesDto;
      }
    );

    const result: ResultsPresidentDto = {
      count_record: countRecords,
      total_votes: totalVotes,
      president_votes: president_votes,
    };

    return result;
  }

  async create(
    ssn: SessionDto,
    input: CreateRecordInput
    // image?: FileUpload
  ): Promise<RecordEntity> {
    const idsCandidates =
      input?.detail
        ?.filter((item) => item.candidate_id)
        .map((item) => item.candidate_id) || [];
    const idsParty =
      input?.detail
        ?.filter((item) => item.movimiento_interno_id)
        .map((item) => item.movimiento_interno_id) || [];
    const idsAlliance =
      input?.detail
        ?.filter((item) => item.political_alliance_id)
        .map((item) => item.political_alliance_id) || [];

    const uniqueCandidates = [...new Set(idsCandidates)];
    const uniqueParty = [...new Set(idsParty)];
    const uniqueAlliance = [...new Set(idsAlliance)];

    const [existing, parties, alliances, candidates, jrv] = await Promise.all([
      this.findByNumberAndLevel(input.level, input.number),
      this.politicPartyService.findByIds(uniqueParty),
      this.politicalAllianceService.findByIds(uniqueAlliance),
      this.candidateService.findByIds(uniqueCandidates),
      this.jrvService.findById(input.jrv_id),
    ]);

    if (existing)
      throw new CustomException(
        null,
        "Ya existe un registro para este numero de JRV y nivel electoral",
        true
      );

    const record = this.recordRepo.create(input);
    record.created_by = ssn.id;
    record.updated_by = ssn.id;
    if (jrv) record.jrv = jrv;

    const details: Array<RecordDetailEntity> = [];
    if (input.detail.length > 0) {
      for (const detail of input.detail) {
        const party = parties.find(
          (i) => i.id === detail.movimiento_interno_id
        );
        const alliance = alliances.find(
          (i) => i.id === detail.political_alliance_id
        );
        const candidate = candidates.find((i) => i.id === detail.candidate_id);

        const newDetail = this.recordDetailRepo.create(detail);
        newDetail.record = record;
        if (party) newDetail.movimiento_interno = party;
        if (alliance) newDetail.political_alliance = alliance;
        if (candidate) newDetail.candidate = candidate;

        details.push(newDetail);
      }
    }

    const savedItem = await this.dataSource.transaction(async (manager) => {
      const save = await manager.save(record);
      await manager.save(details);
      return save;
    });

    // const savedItem = await getManager().transaction(
    //   async (transactionalEntityManager) => {
    //     const save = await transactionalEntityManager.save(record);
    //     await transactionalEntityManager.save(details);
    //     return save;
    //   }
    // );

    // if (image) {
    //   return await this.addRecordPicture(savedItem, image, input.level);
    // }
    return savedItem;
  }

  async update(
    ssn: SessionDto,
    input: UpdateRecordInput
    // image?: FileUpload
  ): Promise<RecordEntity> {
    const [existing, jrv, record] = await Promise.all([
      this.findByNumberAndLevel(input.level, input.number),
      this.jrvService.findById(input.jrv_id),
      this.findById(input.record_id),
    ]);

    if (existing && existing.id !== input.record_id)
      throw new CustomException(
        null,
        "Ya existe un registro para este numero de JRV y nivel electoral",
        true
      );

    if (!record) {
      throw new CustomException(null, "El acta no existe", true);
    }

    const updateRecord = this.recordRepo.merge(record, input);
    updateRecord.updated_by = ssn.id;
    updateRecord.updated_at = new Date();
    if (jrv) updateRecord.jrv = jrv;

    const details: Array<RecordDetailEntity> = await this.mergeDetail(
      updateRecord,
      input,
      ssn
    );

    const savedItem = await this.dataSource.transaction(async (manager) => {
      const save = await manager.save(updateRecord);
      await manager.save(details);
      return save;
    });

    // const savedItem = await getManager().transaction(
    //   async (transactionalEntityManager) => {
    //     const save = await transactionalEntityManager.save(updateRecord);
    //     await transactionalEntityManager.save(details);
    //     return save;
    //   }
    // );

    // if (image) {
    //   return await this.addRecordPicture(savedItem, image, input.level);
    // }
    return savedItem;
  }

  private async mergeDetail(
    updatedRecod: RecordEntity,
    input: UpdateRecordInput,
    session: SessionDto
  ): Promise<RecordDetailEntity[]> {
    const idsCandidates =
      input?.detail
        ?.filter((item) => item.candidate_id)
        .map((item) => item.candidate_id) || [];
    const idsParty =
      input?.detail
        ?.filter((item) => item.movimiento_interno_id)
        .map((item) => item.movimiento_interno_id) || [];
    const idsAlliance =
      input?.detail
        ?.filter((item) => item.political_alliance_id)
        .map((item) => item.political_alliance_id) || [];

    const uniqueCandidates = [...new Set(idsCandidates)];
    const uniqueParty = [...new Set(idsParty)];
    const uniqueAlliance = [...new Set(idsAlliance)];

    const [parties, alliances, candidates, recordDetailDB] = await Promise.all([
      this.politicPartyService.findByIds(uniqueParty),
      this.politicalAllianceService.findByIds(uniqueAlliance),
      this.candidateService.findByIds(uniqueCandidates),
      this.findDetailByRecord(updatedRecod.id),
    ]);

    //const recordDetailDB = await this.findDetailByRecord(updatedRecod.id);
    const detailInput = input.detail;

    recordDetailDB.forEach((detail) => {
      if (!detailInput.some((d) => d.detail_id === detail?.id)) {
        detail.active = false;
        detail.deleted_by = session.id;
        detail.deleted_at = new Date();
      }
    });

    detailInput.forEach((detail) => {
      const party = parties.find((i) => i.id === detail.movimiento_interno_id);
      const alliance = alliances.find(
        (i) => i.id === detail.political_alliance_id
      );
      const candidate = candidates.find((i) => i.id === detail.candidate_id);

      const indexDetail = recordDetailDB.findIndex(
        (d) => d?.id === detail.detail_id && d.active
      );
      if (indexDetail < 0) {
        const newDetail = this.recordDetailRepo.create(detail);
        newDetail.created_by = session.id;
        newDetail.updated_by = session.id;
        newDetail.record = updatedRecod;
        if (party) newDetail.movimiento_interno = party;
        if (alliance) newDetail.political_alliance = alliance;
        if (candidate) newDetail.candidate = candidate;
        recordDetailDB.push(newDetail);
      } else {
        recordDetailDB[indexDetail].updated_by = session.id;
        recordDetailDB[indexDetail].updated_at = new Date();
        if (party) recordDetailDB[indexDetail].movimiento_interno = party;
        if (alliance) recordDetailDB[indexDetail].political_alliance = alliance;
        if (candidate) recordDetailDB[indexDetail].candidate = candidate;
        recordDetailDB[indexDetail].number_box = detail.number_box;
        recordDetailDB[indexDetail].votes = detail.votes;
      }
    });

    return recordDetailDB;
  }

  // private async addRecordPicture(
  //   record: RecordEntity,
  //   file: FileUpload,
  //   level: ELECTORAL_LEVEL
  // ) {
  //   if (!record) throw new CustomException(null, "Product not found", true);

  //   if (!file) throw new CustomException(null, "Could not process file", true);
  //   const { buffer, filename, contentType } = await convertFileIntoBuffer(file);
  //   if (buffer === null) {
  //     throw new CustomException(null, "Could not convert file", true);
  //   }

  //   const { url } = await this.filesService.uploadPublicFile({
  //     dataBuffer: buffer,
  //     filename,
  //     folder: getFolderFile(level),
  //     contentType,
  //   });

  //   if (!url) throw new CustomException(null, "Could not upload file", true);

  //   const currentUrl = record.image_url;
  //   record.image_url = url;
  //   const saveRecord = await this.recordRepo.save(record);
  //   if (saveRecord) {
  //     await this.filesService.deletePublicFile(currentUrl);
  //   } else {
  //     await this.filesService.deletePublicFile(url);
  //   }

  //   return saveRecord;
  // }
}
