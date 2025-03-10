import { Resolver, Query, Args } from "@nestjs/graphql";
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

import { JrvEntity } from "src/entities/jrv/jrv.entity";
import { JrvService } from "./jrv.service";
import { JRV_InfoDTO } from "./dto/jrv.input";

@Resolver(() => JrvEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JrvResolver {
  constructor(private readonly jrvService: JrvService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "jrv" })
  @Query(() => [JrvEntity], { name: "jrvs", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.jrvService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "jrv" })
  @Query(() => JrvEntity, { name: "jrvById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.jrvService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "jrv" })
  @Query(() => [JrvEntity], { name: "jrvByIds", nullable: true })
  findByIds(@Args("ids", { type: () => [String] }) ids: [string]) {
    return this.jrvService.findByIds(ids);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "jrv" })
  @Query(() => [JrvEntity], { name: "jrvByVotingCenter", nullable: true })
  findByVotingCenter(
    @Args("voting_center_id", { type: () => String }) voting_center_id: string
  ) {
    return this.jrvService.findByVotingCenter(voting_center_id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "jrv" })
  //@UseInterceptors(GqlCacheInterceptor)
  @Query(() => [JRV_InfoDTO], { name: "jrvByNumber", nullable: true })
  findByNumber(@Args("number", { type: () => Number }) number: number) {
    return this.jrvService.findByNumber(number);
  }
}
