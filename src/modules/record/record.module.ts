import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// import { FilesModule } from "src/modules/file/files.module";
import { MovimientoInternoModule } from "src/modules/movimiento-interno/movimiento-interno.module";
import { PoliticalAllianceModule } from "src/modules/political-alliance/political-alliance.module";
import { CandidateModule } from "src/modules/candidate/candidate.module";
import { JrvModule } from "src/modules/jrv/jrv.module";

import { RecordEntity } from "src/entities/record/record.entity";
import { RecordDetailEntity } from "src/entities/record/record-detail.entity";

import { RecordService } from "./record.service";
import { RecordResolver } from "./record.resolver";

@Module({
  imports: [
    // FilesModule,
    MovimientoInternoModule,
    PoliticalAllianceModule,
    CandidateModule,
    JrvModule,
    TypeOrmModule.forFeature([RecordEntity, RecordDetailEntity]),
  ],
  providers: [RecordService, RecordResolver],
  exports: [RecordService],
})
export class RecordModule {}
