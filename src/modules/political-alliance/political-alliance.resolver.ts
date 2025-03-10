import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
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

import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";

import {
  CreatePoliticalAllianceInput,
  UpdatePoliticalAllianceInput,
} from "./dto/political-alliance.input";
import { PoliticalAllianceService } from "./political-alliance.service";

@Resolver(() => PoliticalAllianceEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PoliticalAllianceResolver {
  constructor(
    private readonly politicalAllianceService: PoliticalAllianceService
  ) {}

  @UseGuards(ACGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "political-alliance",
  })
  @Query(() => [PoliticalAllianceEntity], {
    name: "politicalAlliances",
    nullable: true,
  })
  findAll(@UserSession() ssn: SessionDto) {
    return this.politicalAllianceService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "political-alliance",
  })
  @Query(() => PoliticalAllianceEntity, {
    name: "politicalAllianceById",
    nullable: true,
  })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.politicalAllianceService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "political-alliance",
  })
  @Query(() => PoliticalAllianceEntity, {
    name: "politicalAllianceBySlug",
    nullable: true,
  })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.politicalAllianceService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "political-alliance",
  })
  @Query(() => [PoliticalAllianceEntity], {
    name: "politicalAllianceByLevel",
    nullable: true,
  })
  findByLevel(
    @Args("electoralLevel", { type: () => ELECTORAL_LEVEL })
    electoralLevel: ELECTORAL_LEVEL
  ) {
    return this.politicalAllianceService.findByElectoralLevel(electoralLevel);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "create",
    possession: "any",
    resource: "political-alliance",
  })
  @Mutation(() => PoliticalAllianceEntity)
  createPoliticParty(
    @Args("input") input: CreatePoliticalAllianceInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.politicalAllianceService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "update",
    possession: "any",
    resource: "political-alliance",
  })
  @Mutation(() => PoliticalAllianceEntity)
  updatePoliticParty(
    @Args("input") input: UpdatePoliticalAllianceInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.politicalAllianceService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    action: "delete",
    possession: "any",
    resource: "political-alliance",
  })
  @Mutation(() => [String])
  removePoliticParty(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.politicalAllianceService.remove(id, ssn);
  }
}
