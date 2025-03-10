import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
config();

const configService = new ConfigService();

console.info(
  "POSTGRES_PASSWORD: ",
  configService.get<string>("POSTGRES_PASSWORD")
);

const AppDataSource = new DataSource({
  type: "postgres",
  host: configService.get<string>("POSTGRES_HOST"),
  port: parseInt(configService.get<string>("POSTGRES_PORT") || "25060", 25060),
  username: configService.get<string>("POSTGRES_USER"),
  password: configService.get<string>("POSTGRES_PASSWORD"),
  database: configService.get<string>("POSTGRES_DB"),
  synchronize: false,
  entities: ["**/*.entity.ts"],
  migrations: ["src/database/migrations/*-migration.ts"],
  migrationsRun: false,
  ssl: { rejectUnauthorized: false },
  logging: true,
});

export default AppDataSource;
