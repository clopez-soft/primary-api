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

import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";

import {
  CreateMovimientoInternoInput,
  UpdateMovimientoInternoInput,
} from "./dto/movimiento-interno.input";
import { MovimientoInternoService } from "./movimiento-interno.service";

@Resolver(() => MovimientoInternoEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MovimientoInternoResolver {
  constructor(private readonly politicPartyService: MovimientoInternoService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "politic-party" })
  @Query(() => [MovimientoInternoEntity], {
    name: "politicParties",
    nullable: true,
  })
  findAll(@UserSession() ssn: SessionDto) {
    return this.politicPartyService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "politic-party" })
  @Query(() => MovimientoInternoEntity, {
    name: "politicPartyById",
    nullable: true,
  })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.politicPartyService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "politic-party" })
  @Query(() => MovimientoInternoEntity, {
    name: "politicPartyBySlug",
    nullable: true,
  })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.politicPartyService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "politic-party" })
  @Mutation(() => MovimientoInternoEntity)
  createPoliticParty(
    @Args("input") input: CreateMovimientoInternoInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.politicPartyService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "politic-party" })
  @Mutation(() => MovimientoInternoEntity)
  updatePoliticParty(
    @Args("input") input: UpdateMovimientoInternoInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.politicPartyService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "politic-party" })
  @Mutation(() => [String])
  removePoliticParty(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.politicPartyService.remove(id, ssn);
  }
}
