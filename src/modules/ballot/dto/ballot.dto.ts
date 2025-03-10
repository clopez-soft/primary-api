import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MovimientoInternoDto {
  @Field()
  movimiento_interno_id: string;

  @Field()
  movimiento_interno_name: string;

  @Field()
  movimiento_interno_code: string;

  @Field()
  movimiento_interno_image: string;
}

@ObjectType()
export class PoliticalAllianceDto {
  @Field()
  political_alliance_id: string;

  @Field()
  political_alliance_name: string;

  @Field()
  political_alliance_code: string;

  @Field()
  political_alliance_image: string;
}

@ObjectType()
export class BallotStandartDto {
  @Field()
  candidate_id: string;

  @Field()
  candidate_name: string;

  @Field()
  candidate_box: number;

  @Field()
  candidate_image: string;

  @Field()
  candidate_falg: string;

  @Field()
  movimiento_interno: MovimientoInternoDto;

  @Field()
  political_alliance: PoliticalAllianceDto;
}

@ObjectType()
export class CandidateCongressDto {
  @Field()
  movimiento_interno_id: string;

  @Field()
  candidate_id: string;

  @Field()
  candidate_name: string;

  @Field()
  candidate_box: number;

  @Field()
  candidate_image: string;
}

@ObjectType()
export class BallotCongressDto {
  @Field()
  movimiento_interno_id: string;

  @Field()
  movimiento_interno_name: string;

  @Field()
  movimiento_interno_code: string;

  @Field()
  movimiento_interno_image: string;

  @Field()
  sequence: number;

  @Field(() => [CandidateDto])
  candidates: CandidateDto[];
}

@ObjectType()
export class CandidateDto {
  @Field()
  candidate_id: string;

  @Field()
  candidate_name: string;

  @Field()
  candidate_box: number;

  @Field()
  candidate_image: string;
}
