import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

import { RoleEntity } from "src/entities/security/role.entity";
import { UserEntity } from "src/entities/user.entity";
import { CountryEntity } from "src/entities/locations/country.entity";
import { DepartmentEntity } from "src/entities/locations/department.entity";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { BallotEntity } from "src/entities/ballot/ballot.entity";
import { BallotDetailEntity } from "src/entities/ballot/ballot-detail.entity";
import { CandidateEntity } from "src/entities/candidate.entity";

import { Seeder } from "./seeder";
import { SeederService } from "./seeder.services";

import config from "src/config";
import { enviroments } from "src/common/enviroments";
import { DatabaseModule } from "../database.module";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
let envFilePath = ".env";
if (process.env.NODE_ENV) {
  envFilePath = enviroments[process.env.NODE_ENV] || ".env";
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        PORT: Joi.number().required(),
        POSTGRES_CNN_NAME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        JWT_SECRETKEY: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      UserEntity,
      CountryEntity,
      DepartmentEntity,
      MunicipalityEntity,
      MovimientoInternoEntity,
      PoliticalAllianceEntity,
      BallotEntity,
      BallotDetailEntity,
      CandidateEntity,
    ]),
  ],
  providers: [SeederService, Seeder],
})
export class SeederModule {}
