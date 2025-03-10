import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { BaseEntity } from "src/entities/base.entity";

import { CreateBaseInput, UpdateBaseInput } from "./base.input";
import { BaseService } from "./base.service";

@Resolver(() => BaseEntity)
@UseGuards(JwtAuthGuard)
export class BaseResolver {
  constructor(private readonly baseService: BaseService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "base" })
  @Query(() => [BaseEntity], { name: "bases", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.baseService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "base" })
  @Query(() => BaseEntity, { name: "baseById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.baseService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "base" })
  @Query(() => BaseEntity, { name: "baseBySlug", nullable: true })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.baseService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "base" })
  @Mutation(() => BaseEntity)
  create(
    @Args("input") input: CreateBaseInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.baseService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "base" })
  @Mutation(() => BaseEntity)
  update(
    @Args("input") input: UpdateBaseInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.baseService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "base" })
  @Mutation(() => [String])
  remove(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.baseService.remove(id, ssn);
  }
}
