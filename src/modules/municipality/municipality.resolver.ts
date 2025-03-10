import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { MunicipalityEntity } from "src/entities/locations/municipality.entity";

import {
  CreateMunicipalityInput,
  UpdateMunicipalityInput,
} from "./dto/municipality.input";
import { MunicipalityService } from "./municipality.service";

@Resolver(() => MunicipalityEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MunicipalityResolver {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "municipality" })
  @Query(() => [MunicipalityEntity], { name: "municipalities", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.municipalityService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "municipality" })
  @Query(() => MunicipalityEntity, { name: "municipalityById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.municipalityService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "municipality" })
  @Query(() => MunicipalityEntity, {
    name: "municipalityBySlug",
    nullable: true,
  })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.municipalityService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "municipality" })
  @Mutation(() => MunicipalityEntity)
  createMunicipality(
    @Args("input") input: CreateMunicipalityInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.municipalityService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "municipality" })
  @Mutation(() => MunicipalityEntity)
  updateMunicipality(
    @Args("input") input: UpdateMunicipalityInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.municipalityService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "municipality" })
  @Mutation(() => [String])
  removeMunicipality(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.municipalityService.remove(id, ssn);
  }
}
