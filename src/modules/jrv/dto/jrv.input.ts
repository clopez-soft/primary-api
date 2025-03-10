import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";
import { AREA_ELECTORAL_SECTOR } from 'src/common/enums';



@ObjectType()
export class CountryDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;
}


@ObjectType()
export class DepartmentDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;
}

@ObjectType()
export class MunicipalityDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;
}

@ObjectType()
export class VotingCenterDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  electoral_sector: string;

  @Field(() => AREA_ELECTORAL_SECTOR)
  @IsEnum(AREA_ELECTORAL_SECTOR)
  area: AREA_ELECTORAL_SECTOR;
}

@ObjectType()
export class JRV_InfoDTO {

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  number: number;

  @Field()
  electoral_weight: number;

  @Field()
  country: CountryDTO;

  @Field()
  department: DepartmentDTO;

  @Field()
  municipality: MunicipalityDTO;


  @Field()
  voting_center: VotingCenterDTO;

}