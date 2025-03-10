import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ROLE_ACESS } from 'src/common/enums';

@InputType()
export class ChangeRoleInput {

  @Field(() => String, { description: 'User Id' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field(() => ROLE_ACESS, { description: 'role Type' })
  @IsEnum(ROLE_ACESS)
  @IsNotEmpty()
  roleId: ROLE_ACESS;
}
