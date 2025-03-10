import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { DepartmentModule } from "src/modules/department/department.module";

import { MunicipalityService } from "./municipality.service";
import { MunicipalityResolver } from "./municipality.resolver";

@Module({
  imports: [DepartmentModule, TypeOrmModule.forFeature([MunicipalityEntity])],
  providers: [MunicipalityResolver, MunicipalityService],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
