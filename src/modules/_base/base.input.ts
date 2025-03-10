import { InputType, Field } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

@InputType()
export class CreateBaseInput {
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  name: string;

  @IsString()
  @Field({ nullable: true })
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field({
    nullable: true,
    defaultValue: false,
    description: "Should get the user to enter an answer?",
  })
  require: boolean;
}

@InputType()
export class UpdateBaseInput extends CreateBaseInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  base_id: string;
}
