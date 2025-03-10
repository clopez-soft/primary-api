import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
// import GraphQLUpload, { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

// import { GqlCacheInterceptor } from "src/custom/gql-cache.interceptor";
import { ELECTORAL_LEVEL } from "src/common/enums";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { RecordEntity } from "src/entities/record/record.entity";
import { RecordService } from "./record.service";
import { CreateRecordInput, UpdateRecordInput } from "./dto/record.input";
import {
  RecordDetailDto,
  ResultsCongressDto,
  ResultsMayorDto,
  ResultsPresidentDto,
} from "./dto/record.dto";

@Resolver(() => RecordEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class RecordResolver {
  constructor(private readonly recordService: RecordService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  // @UseInterceptors(GqlCacheInterceptor)
  @Query(() => [RecordEntity], { name: "records", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.recordService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  // @UseInterceptors(GqlCacheInterceptor)
  @Query(() => RecordEntity, { name: "recordById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.recordService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  // @UseInterceptors(GqlCacheInterceptor)
  @Query(() => [RecordEntity], { name: "recordByIds", nullable: true })
  findByIds(@Args("ids", { type: () => [String] }) ids: string[]) {
    return this.recordService.findByIds(ids);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  @Query(() => RecordEntity, { name: "recordByNumberAndLevel", nullable: true })
  findByNumberAndLevel(
    @Args("jrv_number", { type: () => Number }) jrv_number: number,
    @Args("electoralLevel", { type: () => ELECTORAL_LEVEL })
    electoralLevel: ELECTORAL_LEVEL
  ) {
    return this.recordService.findByNumberAndLevel(electoralLevel, jrv_number);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record-enums" })
  // @UseInterceptors(GqlCacheInterceptor)
  @Query(() => [ELECTORAL_LEVEL], {
    name: "electoralLevelEnums",
    nullable: false,
  })
  getTypes() {
    return this.recordService.electoralLevels();
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  @ResolveField(() => [RecordDetailDto], { nullable: true })
  async detail_by_record(
    @Parent() record: RecordEntity
  ): Promise<RecordDetailDto[]> {
    const { id } = record;
    return this.recordService.findDetailByRecordDto(id, true);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  //@UseInterceptors(GqlCacheInterceptor)
  @Query(() => ResultsCongressDto, { name: "congressResults", nullable: true })
  congressResults(
    @Args("municipality_id", { type: () => String, nullable: true })
    municipality_id: string
  ) {
    return this.recordService.getCongressResult(municipality_id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  //@UseInterceptors(GqlCacheInterceptor)
  @Query(() => ResultsMayorDto, { name: "mayorResults", nullable: true })
  mayorResults(
    @Args("municipality_id", { type: () => String }) municipality_id: string
  ) {
    return this.recordService.getMayorResult(municipality_id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "record" })
  //@UseInterceptors(GqlCacheInterceptor)
  @Query(() => ResultsPresidentDto, {
    name: "presidentResults",
    nullable: true,
  })
  presidentResults() {
    return this.recordService.getPresidentResult();
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "record" })
  @Mutation(() => RecordEntity)
  createRecord(
    @Args("input") input: CreateRecordInput,
    @UserSession() ssn: SessionDto
    // @Args({ name: "image", nullable: true, type: () => GraphQLUpload })
    // image: FileUpload
  ) {
    return this.recordService.create(ssn, input);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "record" })
  @Mutation(() => RecordEntity)
  updateRecord(
    @Args("input") input: UpdateRecordInput,
    @UserSession() ssn: SessionDto
    // @Args({ name: "image", nullable: true, type: () => GraphQLUpload })
    // image: FileUpload
  ) {
    return this.recordService.update(ssn, input);
  }
}
