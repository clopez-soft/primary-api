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
export class CreateMunicipalityInput {
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

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  department_id: string;
}

@InputType()
export class UpdateMunicipalityInput extends CreateMunicipalityInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  municipality_id: string;
}
