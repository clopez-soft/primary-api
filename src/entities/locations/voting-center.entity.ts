import { Entity, Index, ManyToOne, JoinColumn, Column } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { CountryEntity } from "src/entities/locations/country.entity";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { AREA_ELECTORAL_SECTOR } from "src/common/enums";

@Entity("voting_center")
@Index(["municipality", "active"])
@Index(["area", "active"])
@ObjectType()
export class VotingCenterEntity extends CountryEntity {
  @Field(() => MunicipalityEntity, { nullable: true })
  @JoinColumn({ name: "municipality_id", referencedColumnName: "id" })
  @ManyToOne(() => MunicipalityEntity)
  @Expose()
  municipality: MunicipalityEntity;

  @Column({
    type: "enum",
    enum: AREA_ELECTORAL_SECTOR,
    nullable: false,
    default: AREA_ELECTORAL_SECTOR.URBAN,
  })
  @Field(() => AREA_ELECTORAL_SECTOR, {
    nullable: false,
    defaultValue: AREA_ELECTORAL_SECTOR.URBAN,
  })
  @IsEnum(AREA_ELECTORAL_SECTOR)
  @Expose()
  area: AREA_ELECTORAL_SECTOR;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @Expose()
  electoral_sector: string;
}
