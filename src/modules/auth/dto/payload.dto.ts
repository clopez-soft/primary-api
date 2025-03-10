import { ArgsType } from "@nestjs/graphql";
import { ROLE_ACESS, USER_TYPE } from "src/common/enums";

export class JwtPayloadDto {
  id: string;
  email: string;
  screen_name: string;
  picture: string;
  role: ROLE_ACESS;
  user_type: USER_TYPE;
}

@ArgsType()
export class AccessToken {
  accessToken: any;
  expiresIn: string;
}
