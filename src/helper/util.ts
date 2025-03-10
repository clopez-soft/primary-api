import * as bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";
import { v4 } from "uuid";
// import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { ELECTORAL_LEVEL } from "src/common/enums";

const slug = require("limax");

export const GeneratePassword = async (
  email: string,
  clearPassword: string
) => {
  const saltRounds = 10;
  const passCombination = email + "_" + clearPassword;
  const password = await bcrypt.hash(passCombination, saltRounds);
  return password;
};

export const ComparePassword = async (
  encripedPassWord: string,
  clearPassWord: string
) => {
  return await bcrypt.compare(clearPassWord, encripedPassWord);
};

export const Gen_v4 = () => {
  const code = v4();
  return code;
};

export const GenerateRandomPw = () => {
  const code = Gen_v4();
  return code.toString().split("-")[0];
};

export const GetToken = (token: string): string => {
  if (!token) return "";

  let jwt = token;
  if (jwt.startsWith("Bearer")) jwt = jwt.split(" ")[1];

  return jwt;
};

export const DecodeToken = (data: any): SessionDto | null => {
  if (!data) return null;

  const jwt = GetToken(data);

  const decode = jwtDecode(jwt);
  if (!decode) return null;

  return {
    email: decode["email"],
    id: decode["id"],
    screen_name: decode["screen_name"],
    picture: decode["picture"],
    user_type: decode["user_type"],
    role: decode["role"],
    exp: decode["exp"] ? decode["exp"] : 0,
    accessToken: jwt,
  };
};

export const GenerateConfirmCode = (): string => {
  const code = Gen_v4();
  const token =
    code.toUpperCase().split("-")[2].substring(0, 3) +
    "-" +
    code.toUpperCase().split("-")[1].substring(0, 3);
  return token;
};

export const Slugify = (text: string): string => {
  if (!text) return "";
  const transform = slug(text, {
    lang: "en",
    separateNumbers: true,
    maintainCase: false,
  });
  return transform;
};

export const btoa = (str: string) => {
  return Buffer.from(str).toString("base64");
};

export const redisKey = (resolver: string, endpoint: string, args?: any) => {
  const cacheKey = `r_${resolver}-ep_${endpoint}`;
  let params = "";
  if (args && Object.keys(args).length > 0)
    params = "-arg_" + btoa(JSON.stringify(args));

  const key = `${cacheKey}${params}`;
  return key;
};

export function sortStringArray(): (a: string, b: string) => number {
  return (a, b) => {
    const valueA = a.toUpperCase();
    const valueB = b.toUpperCase();

    if (valueA < valueB) {
      return -1;
    }

    if (valueA > valueB) {
      return 1;
    }

    return 0;
  };
}

export const toSafeString = (value: any): string => {
  if (value === undefined) return "";
  if (value === null) return "";

  return `${value}`;
};

export const toSafeNumber = (value: any): number => {
  if (value === undefined) return 0;
  if (value === null) return 0;
  if (value === "") return 0;

  return +`${value}`;
};

// export async function convertFileIntoBuffer(
//   file: FileUpload
// ): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
//   const anyFile = file as any;
//   if (!anyFile.createReadStream)
//     return { buffer: Buffer.alloc(0), filename: "", contentType: "" };

//   const { createReadStream, filename, mimetype } = file;
//   const ms = createReadStream();
//   const buffer = (await convertReadStreamIntoBuffer(ms)) as Buffer;
//   return { buffer, filename: filename, contentType: mimetype };
// }

export function convertReadStreamIntoBuffer(stream: NodeJS.ReadableStream) {
  return new Promise(async (resolve, reject) => {
    try {
      const chunks: Buffer[] = [];

      stream.once("error", (err) => {
        reject(err);
      });

      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getFolderFile(level: ELECTORAL_LEVEL) {
  switch (level) {
    case ELECTORAL_LEVEL.PRESIDENT:
      return "presidente";
    case ELECTORAL_LEVEL.MAYOR:
      return "alcalde";
    case ELECTORAL_LEVEL.CONGRESS:
      return "diputado";
    default:
      return "otros";
  }
}
