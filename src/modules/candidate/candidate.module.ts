import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CandidateEntity } from "src/entities/candidate.entity";

import { CandidateService } from "./candidate.service";
import { CandidateResolver } from "./candidate.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  providers: [CandidateService, CandidateResolver],
  exports: [CandidateService],
})
export class CandidateModule {}
