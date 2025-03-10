const numericTypes = [
  "integer",
  "int",
  "int2",
  "int4",
  "int8",
  "float",
  "float4",
  "float8",
  "numeric",
  "decimal",
  "smallint",
  "bigint",
  "real",
  "money",
];
const dateTypes = ["date", "timestamp", "timestamptz", "time", "interval"];
const stringTypes = [
  "text",
  "varchar",
  "character",
  "char",
  "name",
  "bpchar",
  "uuid",
  "varying",
  "enum",
];
const booleanTypes = ["bool", "boolean"];
const jsonTypes = ["json", "jsonb"];

//Convert postgress types to javascript types
export function typeTransform(type: string): string {
  if (numericTypes.includes(type)) return "number";

  if (dateTypes.includes(type)) return "date";

  if (stringTypes.includes(type)) return "string";

  if (booleanTypes.includes(type)) return "boolean";

  if (jsonTypes.includes(type)) return "object";

  return "any";
}
