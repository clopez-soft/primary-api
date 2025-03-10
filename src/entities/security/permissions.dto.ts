import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsBoolean, IsEnum } from "class-validator";
import { SPECIAL_PERMISSION } from "src/common/enums";

@ObjectType("SpecialPermissionType")
@InputType("SpecialPermissionInput")
export class SpecialPermissionDto {
  @Field(() => SPECIAL_PERMISSION, { nullable: true })
  @IsEnum(SPECIAL_PERMISSION)
  @IsNotEmpty()
  permission: SPECIAL_PERMISSION;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
