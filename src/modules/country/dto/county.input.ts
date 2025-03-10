import { InputType, Field, Int } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsPositive,
  IsInt,
  IsNumber,
} from "class-validator";

@InputType()
export class CreateCountryInput {
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  code: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPositive()
  electoral_weight: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsNumber()
  number_jrv: number;
}

@InputType()
export class UpdateCountryInput extends CreateCountryInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  country_id: string;
}
