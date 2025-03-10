import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';


const message = (type: string): string => `Make sure the ${type} password is between 5-20 characters long`;

@InputType()
export class ChangePasswordInput {

  @Field(() => String, { description: 'current password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: message('current') })
  currentPassword: string;

  @Field(() => String, { description: 'new password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: message('new') })
  @MaxLength(20, { message: message('new') })
  newPassword: string;
}