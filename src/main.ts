import { NestFactory } from "@nestjs/core";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
// import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { hostname, version } from "os";
// import { config as AwsConfig } from "aws-sdk";

import { QueryExceptionFilter } from "src/custom/save-db.exception";
import { AppModule } from "./app.module";
import config from "./config";

const allowlist = [
  "http://localhost:3000",
  "http://localhost:5050",
  "http://localhost:5050/graphql",
  "https://dev-store.develappglobal.com",
  "https://dev-store.develappglobal.com/graphql",
  "https://storefront.budlink.app",
  "https://storefront.budlink.app/graphql",
  "http://192.168.68.53:3000",
  "http://127.0.0.1:3000/",
  "http:/localhost:4173/",
  // "http:/localhost:8080/",
  "http://localhost:8080",
  "http://127.0.0.1:4173/",
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalFilters(new QueryExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
  );
  // app.enableCors({
  //   origin: "http://localhost:8080/",
  //   methods: "GET,POST,PUT,DELETE,OPTIONS",
  //   allowedHeaders: "Content-Type,Authorization",
  // });
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const index = allowlist.indexOf(origin);
      if (index !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });

  // app.use(graphqlUploadExpress({ maxFileSize: 5 * 1000 * 1000, maxFiles: 10 }));

  const cf = config();
  // const aws_key = cf.files.aws.accessKeyId;
  // const aws_secret = cf.files.aws.secretAccessKey;
  // const aws_region = cf.files.aws.region;

  // AwsConfig.update({
  //   accessKeyId: aws_key,
  //   secretAccessKey: aws_secret,
  //   region: aws_region,
  // });

  await app.listen(cf.PORT, () => {
    try {
      const result = {
        apiVersion: cf.VERSION,
        enviroment: cf.ENVIROMENT,
        hostname: hostname(),
        host: cf.HOST,
        port: cf.PORT,
        sendEmails: cf.mail.sendEmails,
        url: `http://${cf.HOST}:${cf.PORT}/graphql`,
        version: version(),
      };

      console.table(result);
    } catch (error) {
      console.log("TCL: bootstrap -> error", error);
    }
  });
}
bootstrap();
