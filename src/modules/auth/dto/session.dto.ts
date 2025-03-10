import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";
import { ROLE_ACESS, USER_TYPE } from "src/common/enums";
import { PermissionDto } from "src/modules/authorization/permission.dto";

@ObjectType()
export class SessionDto {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: true })
  picture: string;

  @Field({ nullable: true })
  screen_name: string;

  @Field(() => ROLE_ACESS, { nullable: false })
  @IsEnum(ROLE_ACESS)
  role: ROLE_ACESS;

  @Field(() => USER_TYPE, { nullable: false })
  @IsEnum(USER_TYPE)
  user_type: USER_TYPE;

  @Field({ nullable: false })
  accessToken: string;

  @Field({ nullable: false })
  exp: number;
}

@ObjectType()
export class LoginStatusDto {
  @Field(() => SessionDto, { nullable: false })
  session: SessionDto;

  @Field(() => PermissionDto, { nullable: false })
  permissions: PermissionDto;
}
