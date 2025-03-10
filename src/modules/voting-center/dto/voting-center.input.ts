import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsPositive, IsInt, IsNumber, IsEnum } from 'class-validator';

import { AREA_ELECTORAL_SECTOR } from 'src/common/enums';

@InputType()
export class CreateVotingCenterInput {
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

  @Field(() => AREA_ELECTORAL_SECTOR, { nullable: false, defaultValue: AREA_ELECTORAL_SECTOR.URBAN })
  @IsEnum(AREA_ELECTORAL_SECTOR)
  @IsNotEmpty()
  area: AREA_ELECTORAL_SECTOR;

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
  municipality_id: string;

}

@InputType()
export class UpdateVotingCenterInput extends CreateVotingCenterInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  voting_center_id: string;
}