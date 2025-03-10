import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import * as Joi from "joi";

import { enviroments } from "src/common/enviroments";
import { ENVIROMENT } from "src/common/enums";
import config from "src/config";

import { DatabaseModule } from "src/database/database.module";
import { UsersModule } from "src/modules/users/users.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { AccessControlModule } from "src/modules/authorization/ac.module";
import { roles } from "src/modules/authorization/app.roles";
// import { FilesModule } from "src/modules/file/files.module";

import { CountryModule } from "src/modules/country/country.module";
import { DepartmentModule } from "src/modules/department/department.module";
import { MunicipalityModule } from "src/modules/municipality/municipality.module";
import { VotingCenterModule } from "src/modules/voting-center/voting-center.module";
import { MovimientoInternoModule } from "src/modules/movimiento-interno/movimiento-interno.module";
import { PoliticalAllianceModule } from "src/modules/political-alliance/political-alliance.module";
import { CandidateModule } from "src/modules/candidate/candidate.module";
import { JrvModule } from "src/modules/jrv/jrv.module";
import { BallotModule } from "src/modules/ballot/ballot.module";
import { RecordModule } from "src/modules/record/record.module";

const cf = config();
let envFilePath = ".env";
if (process.env.NODE_ENV) {
  envFilePath = enviroments[process.env.NODE_ENV] || ".env";
}

interface GraphQLErrorException {
  response?: { message?: string };
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

        MAIL_HOST: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_TTL: Joi.number().required(),
        REDIS_CACHE: Joi.boolean().required(),

        AWS_REGION: Joi.string().required(),
        DO_SPACES_NAME: Joi.string().required(),
        DO_SPACES_KEY: Joi.string().required(),
        DO_SPACES_SECRET: Joi.string().required(),
        DO_SPACES_ENDPOINT: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      debug: false, //cf.ENVIROMENT === ENVIROMENT.DEVELOPMENT,
      playground: cf.ENVIROMENT === ENVIROMENT.DEVELOPMENT,
      sortSchema: false,
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      formatError: (error: GraphQLError) => {
        const exception = error.extensions?.exception as
          | GraphQLErrorException
          | undefined;
        const graphQLFormattedError: GraphQLFormattedError = {
          message: exception?.response?.message || error.message,
        };
        return graphQLFormattedError;
      },
    }),
    AccessControlModule.forRoles(roles),
    DatabaseModule,
    UsersModule,
    AuthModule,
    // FilesModule,
    CountryModule,
    DepartmentModule,
    MunicipalityModule,
    VotingCenterModule,
    MovimientoInternoModule,
    PoliticalAllianceModule,
    CandidateModule,
    JrvModule,
    BallotModule,
    RecordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
