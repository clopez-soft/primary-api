import { Module, Global } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Client } from "pg";
import { TypeOrmModule } from "@nestjs/typeorm";

import config from "src/config";

const API_KEY = "12345634";
const API_KEY_PROD = "PROD1212121SA";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, database, password, port, logging } =
          configService.postgres;
        return {
          type: "postgres",
          host,
          port,
          username: user,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true,
          cache: false,
          // cache: {
          //     type: "database",
          //     tableName: '_query-result-cache'
          // },
          logging: logging === 1 ? true : false,
          entities: ["dist/**/*.entity{.ts,.js}"],
          // migrations: ["dist/database/migrations/*.js"],
          // logging: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: "API_KEY",
      useValue: process.env.NODE_ENV === "prod" ? API_KEY_PROD : API_KEY,
    },
    {
      provide: "PG",
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, database, password, port } = configService.postgres;
        const client = new Client({
          user,
          host,
          database,
          password,
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ["API_KEY", "PG", TypeOrmModule],
})
export class DatabaseModule {}
