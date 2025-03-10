import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VotingCenterEntity } from "src/entities/locations/voting-center.entity";
import { MunicipalityModule } from "src/modules/municipality/municipality.module";

import { VotingCenterService } from "./voting-center.service";
import { VotingCenterResolver } from "./voting-center.resolver";

@Module({
  imports: [MunicipalityModule, TypeOrmModule.forFeature([VotingCenterEntity])],
  providers: [VotingCenterResolver, VotingCenterService],
  exports: [VotingCenterService],
})
export class VotingCenterModule {}
