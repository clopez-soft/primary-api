import { Resolver, Query, Args } from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { ELECTORAL_LEVEL } from "src/common/enums";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { CandidateEntity } from "src/entities/candidate.entity";
import { CandidateService } from "./candidate.service";

@Resolver(() => CandidateEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateResolver {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => [CandidateEntity], { name: "candidates", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.candidateService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => CandidateEntity, { name: "candidateById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.candidateService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => [CandidateEntity], { name: "candidateByLevel", nullable: true })
  findByLevel(
    @Args("electoralLevel", { type: () => ELECTORAL_LEVEL })
    electoralLevel: ELECTORAL_LEVEL
  ) {
    return this.candidateService.findByElectoralLevel(electoralLevel);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => [CandidateEntity], {
    name: "candidateByPartyAndLevel",
    nullable: true,
  })
  findByPartyAndLevel(
    @Args("movimiento_interno_id", { type: () => String })
    movimiento_interno_id: string,
    @Args("electoralLevel", { type: () => ELECTORAL_LEVEL })
    electoralLevel: ELECTORAL_LEVEL
  ) {
    return this.candidateService.findByPartyAndLevel(
      movimiento_interno_id,
      electoralLevel
    );
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => [CandidateEntity], {
    name: "candidateByAllianceAndLevel",
    nullable: true,
  })
  findByAllianceAndLevel(
    @Args("political_alliance_id", { type: () => String })
    political_alliance_id: string,
    @Args("electoralLevel", { type: () => ELECTORAL_LEVEL })
    electoralLevel: ELECTORAL_LEVEL
  ) {
    return this.candidateService.findByAllianceAndLevel(
      political_alliance_id,
      electoralLevel
    );
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "candidate" })
  @Query(() => [CandidateEntity], {
    name: "candidateByMunicipality",
    nullable: true,
  })
  findByMunicipality(
    @Args("municipality_id", { type: () => String }) municipality_id: string
  ) {
    return this.candidateService.findByMunicipality(municipality_id);
  }
}
