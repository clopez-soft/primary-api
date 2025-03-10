import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

@InputType()
export class CreateMovimientoInternoInput {
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
}

@InputType()
export class UpdateMovimientoInternoInput extends CreateMovimientoInternoInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  movimiento_interno_id: string;
}
