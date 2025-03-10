import { Resolver, Query, Args } from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
//import { UserSession } from 'src/modules/authorization/session.decorator';
//import { SessionDto } from 'src/modules/auth/dto/session.dto';
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { ELECTORAL_LEVEL } from "src/common/enums";
import { BallotEntity } from "src/entities/ballot/ballot.entity";
import { BallotService } from "./ballot.service";
import { BallotStandartDto, BallotCongressDto } from "./dto/ballot.dto";

@Resolver(() => BallotEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BallotResolver {
  constructor(private readonly ballotService: BallotService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "ballot" })
  @Query(() => [BallotStandartDto], { name: "ballotByLevel", nullable: true })
  findByLevel(
    @Args("level", { type: () => ELECTORAL_LEVEL }) level: ELECTORAL_LEVEL,
    @Args("location_id", { type: () => String, nullable: true })
    location_id: string
  ) {
    return this.ballotService.findByLevel(level, location_id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "ballot" })
  @Query(() => [BallotCongressDto], {
    name: "ballotByCongress",
    nullable: true,
  })
  findByCongress() {
    return this.ballotService.findByCongress();
  }
}
