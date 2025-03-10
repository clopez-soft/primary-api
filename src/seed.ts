import { NestFactory } from "@nestjs/core";
import { SeederModule } from "src/database/seeders/seeder.module";
import { Seeder } from "./database/seeders/seeder";

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);

      const execute = async () => {
        await seeder.seed();
        // exit(0);
      };

      execute();
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
