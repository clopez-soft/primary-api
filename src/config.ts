import { ENVIROMENT } from "src/common/enums";
import { registerAs } from "@nestjs/config";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export default registerAs("config", () => {
  return {
    ROUND_PRECISION: 2,
    ENVIROMENT: process.env.NODE_ENV || ENVIROMENT.DEVELOPMENT,
    LOGGER: false,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
    HOST: "localhost",
    GEN_DOCS: true,
    VERSION: "21.10.22.2255",
    apiKey: process.env.API_KEY,
    JWT_SECRETKEY: process.env.JWT_SECRETKEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1w",
    SITE_URL: "https://electoral.api.com/",
    redis: {
      useCache: process.env.REDIS_CACHE
        ? Boolean(process.env.REDIS_CACHE)
        : false,
      url: process.env.REDIS_HOST || "redis://localhost:6379",
      port: process.env.REDIS_PORT || 6379,
    },
    files: {
      aws: {
        bucket: process.env.DO_SPACES_NAME,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
      },
    },
    mail: {
      sendEmails: false,
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM,
    },
    postgres: {
      name: process.env.POSTGRES_CNN_NAME,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT)
        : 25060,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: false,
      logging: process.env.POSTGRES_DEBUG_QUERIES
        ? parseInt(process.env.POSTGRES_DEBUG_QUERIES)
        : 0,
    },
  };
});
