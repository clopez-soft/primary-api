import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BallotEntity } from "src/entities/ballot/ballot.entity";
import { BallotDetailEntity } from "src/entities/ballot/ballot-detail.entity";

import { BallotService } from "./ballot.service";
import { BallotResolver } from "./ballot.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([BallotEntity, BallotDetailEntity])],
  providers: [BallotService, BallotResolver],
  exports: [BallotService],
})
export class BallotModule {}
