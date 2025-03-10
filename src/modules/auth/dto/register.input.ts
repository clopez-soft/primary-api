import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ROLE_ACESS, USER_TYPE } from "src/common/enums";

@InputType()
export class RegisterUserInput {
  @IsEmail()
  @IsNotEmpty()
  @Field({ description: "Email", nullable: false })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Field({ description: "Clear password", nullable: false })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  last_name: string;

  @IsString()
  @Field({ nullable: true })
  company: string;

  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  @Field(() => USER_TYPE, { nullable: true, defaultValue: USER_TYPE.END_USER })
  type: USER_TYPE;

  @IsEnum(ROLE_ACESS)
  @IsNotEmpty()
  @Field(() => ROLE_ACESS, { nullable: true, defaultValue: ROLE_ACESS.VIEWER })
  _role: ROLE_ACESS;
}

@InputType()
export class confirmEmailInput {
  @IsEmail()
  @IsNotEmpty()
  @Field({ description: "Email", nullable: false })
  readonly email: string;

  @Field(() => String, { description: "token" })
  @IsString()
  @IsNotEmpty()
  token: string;
}
