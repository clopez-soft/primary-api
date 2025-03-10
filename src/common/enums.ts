import { registerEnumType } from "@nestjs/graphql";

export function getEnumValues(enumType: any) {
  return Object.keys(enumType).map((key) => enumType[key]);
}

export const enviroments = {
  dev: ".env",
  stag: ".stag.env",
  prod: ".prod.env",
};

export enum ENVIROMENT {
  DEVELOPMENT = "development",
  LIVE = "production",
}

export enum USER_TYPE {
  END_USER = "end_user",
}

registerEnumType(USER_TYPE, {
  name: "USER_TYPE",
  description: "Type of users",
});

export enum ROLE_ACESS {
  VIEWER = "end_user",
  DIGITIZER = "digitizer",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
  ROOT = "root",
}

registerEnumType(ROLE_ACESS, {
  name: "ROLE_ACESS",
  description: "The supported roles.",
});

export enum ELECTORAL_LEVEL {
  PRESIDENT = "president",
  MAYOR = "mayor",
  CONGRESS = "congress",
}

registerEnumType(ELECTORAL_LEVEL, {
  name: "ELECTORAL_LEVEL",
  description: "Electoral levels",
});

export enum JRV_POSITION_TYPE {
  PRESIDENT = "president",
  SECRETARY = "secretary",
  SCRUTADOR = "scrutator",
  VOCAL1 = "vocal1",
  VOCAL2 = "vocal2",
}

registerEnumType(JRV_POSITION_TYPE, {
  name: "JRV_POSITION_TYPE",
  description: "JRV position types",
});

export enum AREA_ELECTORAL_SECTOR {
  URBAN = "urban",
  RURAL = "rural",
}

registerEnumType(AREA_ELECTORAL_SECTOR, {
  name: "AREA_ELECTORAL_SECTOR",
  description: "Areas of electoral sectors",
});

export enum SPECIAL_PERMISSION {
  REVERT_RECORDS = "revert-records",
}

registerEnumType(SPECIAL_PERMISSION, {
  name: "SPECIAL_PERMISSION",
  description: ``,
});

export enum DATE_DIFF {
  MINUTE = "minute",
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

registerEnumType(DATE_DIFF, {
  name: "DATE_DIFF",
  description: "The supported date diff to handle mutation of dates.",
});
