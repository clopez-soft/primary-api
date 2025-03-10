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

import { CountryEntity } from "src/entities/locations/country.entity";

import { CreateCountryInput, UpdateCountryInput } from "./dto/county.input";
import { CountryService } from "./country.service";

@Resolver(() => CountryEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "country" })
  @Query(() => [CountryEntity], { name: "countries", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.countryService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "country" })
  @Query(() => CountryEntity, { name: "countryById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.countryService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "country" })
  @Query(() => CountryEntity, { name: "countryBySlug", nullable: true })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.countryService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "country" })
  @Mutation(() => CountryEntity)
  createCountry(
    @Args("input") input: CreateCountryInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.countryService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "country" })
  @Mutation(() => CountryEntity)
  updateCountry(
    @Args("input") input: UpdateCountryInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.countryService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "country" })
  @Mutation(() => [String])
  removeCountry(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.countryService.remove(id, ssn);
  }
}
