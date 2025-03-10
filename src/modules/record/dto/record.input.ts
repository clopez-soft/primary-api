import { InputType, Field, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsPositive,
  IsInt,
  IsNumber,
  ValidateIf,
  Min,
  IsArray,
  IsBoolean,
} from "class-validator";
import { IsEnum } from "class-validator";

import { ELECTORAL_LEVEL } from "src/common/enums";

@InputType()
export class CreateRecordInput {
  @Field(() => ELECTORAL_LEVEL)
  @IsEnum(ELECTORAL_LEVEL)
  @IsNotEmpty()
  level: ELECTORAL_LEVEL;

  @Field({ nullable: false })
  @ValidateIf((o) => o.jrv_id)
  @IsUUID()
  jrv_id: string;

  @Field(() => Int, { nullable: false })
  @IsNumber()
  @IsInt()
  @IsPositive()
  number: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.electoral_weight)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  electoral_weight: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.recibed_ballots)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  recibed_ballots: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.leftover_ballots)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  leftover_ballots: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.total_ballots)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  total_ballots: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.voters)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  voters: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.jrv_votes)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  jrv_votes: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.custodians)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  custodians: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.total_voters)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  total_voters: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.valid_votes)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  valid_votes: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.void_votes)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  void_votes: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.blank_votes)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  blank_votes: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.total_votes)
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  total_votes: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  observations: string;

  @Field(() => [RecordDetailInput], { nullable: true })
  @IsOptional()
  @Type(() => RecordDetailInput)
  detail: RecordDetailInput[];

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  with_problems: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  problems: string[];
}

@InputType("rDetailInput")
export class RecordDetailInput {
  @Field({ nullable: true })
  @ValidateIf((o) => o.detail_id)
  @IsString()
  @IsOptional()
  @IsUUID()
  detail_id: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.movimiento_interno_id)
  @IsString()
  @IsOptional()
  @IsUUID()
  movimiento_interno_id: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.political_alliance_id)
  @IsString()
  @IsOptional()
  @IsUUID()
  political_alliance_id: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.candidate_id)
  @IsString()
  @IsOptional()
  @IsUUID()
  candidate_id: string;

  @Field(() => Int)
  @IsInt()
  @IsNumber()
  @Min(0)
  number_box: number;

  @Field(() => Int)
  @IsInt()
  @IsNumber()
  @Min(0)
  votes: number;
}

@InputType()
export class UpdateRecordInput extends CreateRecordInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  record_id: string;
}
