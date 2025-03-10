import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { MovimientoInternoModule } from "src/modules/movimiento-interno/movimiento-interno.module";

import { PoliticalAllianceService } from "./political-alliance.service";
import { PoliticalAllianceResolver } from "./political-alliance.resolver";

@Module({
  imports: [
    MovimientoInternoModule,
    TypeOrmModule.forFeature([PoliticalAllianceEntity]),
  ],
  providers: [PoliticalAllianceService, PoliticalAllianceResolver],
  exports: [PoliticalAllianceService],
})
export class PoliticalAllianceModule {}
