import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class resetPasswordInput {
  @Field(() => String, { description: "Current email" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class resetPasswordConfirmInput {
  @Field(() => String, { description: "Current email" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String, { description: "token" })
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field(() => String, { description: "new password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: "Make sure the password is min 5-20 characters long",
  })
  newPassword: string;
}

@InputType()
export class generatePasswordInput {
  @Field(() => String, { description: "Current email" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String, { description: "new password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: "Make sure the password is between 5-20 characters long",
  })
  password: string;
}
