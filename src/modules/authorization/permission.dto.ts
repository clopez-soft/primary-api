import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsString } from "class-validator";
import GraphQLJSON from "graphql-type-json";

import { ROLE_ACESS } from "src/common/enums";

@ObjectType()
export class PermissionDto {
  @Field(() => GraphQLJSON, { nullable: true })
  menu: object;

  @Field(() => GraphQLJSON, { nullable: true })
  actions: object;
}

@ObjectType()
export class DispensaryRoleDto {
  @Field(() => ROLE_ACESS, { nullable: false })
  @IsEnum(ROLE_ACESS)
  role: ROLE_ACESS;

  @Field({ nullable: false })
  @IsString()
  name: string;

  @Field({ nullable: false })
  @IsString()
  description: string;
}
