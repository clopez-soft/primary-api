import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DepartmentEntity } from "src/entities/locations/department.entity";
import { CountryModule } from "src/modules/country/country.module";

import { DepartmentService } from "./department.service";
import { DepartmentResolver } from "./department.resolver";

@Module({
  imports: [CountryModule, TypeOrmModule.forFeature([DepartmentEntity])],
  providers: [DepartmentResolver, DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
