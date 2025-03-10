import { ROLE_ACESS, USER_TYPE } from "src/common/enums";

export interface UserContextDto {
  id: string;
  email: string;
  name: string;
  type: USER_TYPE;
  role: ROLE_ACESS;
}
