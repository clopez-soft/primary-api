import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CountryEntity } from "src/entities/locations/country.entity";

import { CountryService } from "./country.service";
import { CountryResolver } from "./country.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryResolver, CountryService],
  exports: [CountryService],
})
export class CountryModule {}
