import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { AREA_ELECTORAL_SECTOR } from "src/common/enums";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { VotingCenterEntity } from "src/entities/locations/voting-center.entity";

import {
  CreateVotingCenterInput,
  UpdateVotingCenterInput,
} from "./dto/voting-center.input";
import { VotingCenterService } from "./voting-center.service";

@Resolver(() => VotingCenterEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class VotingCenterResolver {
  constructor(private readonly votingCenterService: VotingCenterService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "voting-center" })
  @Query(() => [VotingCenterEntity], { name: "votingCenters", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.votingCenterService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "voting-center" })
  @Query(() => VotingCenterEntity, { name: "votingCenterById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.votingCenterService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "voting-center" })
  @Query(() => VotingCenterEntity, {
    name: "votingCenterBySlug",
    nullable: true,
  })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.votingCenterService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "voting-center" })
  @Query(() => [VotingCenterEntity], {
    name: "votingCenterByMunicipality",
    nullable: true,
  })
  findByMunicipality(
    @Args("municipality_id", { type: () => String }) municipality_id: string,
    @Args("area", { type: () => AREA_ELECTORAL_SECTOR, nullable: true })
    area: AREA_ELECTORAL_SECTOR
  ) {
    return this.votingCenterService.findByMunicipality(municipality_id, area);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "voting-center-enums",
  })
  @Query(() => [AREA_ELECTORAL_SECTOR], {
    name: "votingCenterAreas",
    nullable: true,
  })
  getAreas() {
    return this.votingCenterService.areaElectoralSector();
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "voting-center" })
  @Mutation(() => VotingCenterEntity)
  createVotingCenter(
    @Args("input") input: CreateVotingCenterInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.votingCenterService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "voting-center" })
  @Mutation(() => VotingCenterEntity)
  updateVotingCenter(
    @Args("input") input: UpdateVotingCenterInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.votingCenterService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "voting-center" })
  @Mutation(() => [String])
  removeVotingCenter(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.votingCenterService.remove(id, ssn);
  }
}
