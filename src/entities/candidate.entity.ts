import {
  Entity,
  Column,
  Index,
  BeforeUpdate,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { BaseEntity } from "src/entities/base.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { CountryEntity } from "src/entities/locations/country.entity";
import { DepartmentEntity } from "src/entities/locations/department.entity";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { ELECTORAL_LEVEL } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("candidate")
@Index(["movimiento_interno", "political_alliance"])
@Index(["box_number", "level"])
@ObjectType()
export class CandidateEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Column({ type: "text", nullable: false })
  @Field({ nullable: false })
  @Expose()
  code: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @Expose()
  description: string;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  box_number: number;

  @Column({
    type: "enum",
    enum: ELECTORAL_LEVEL,
    nullable: false,
    default: ELECTORAL_LEVEL.PRESIDENT,
  })
  @Field(() => ELECTORAL_LEVEL, {
    nullable: false,
    defaultValue: ELECTORAL_LEVEL.PRESIDENT,
  })
  @IsEnum(ELECTORAL_LEVEL)
  @Expose()
  level: ELECTORAL_LEVEL;

  @Field(() => MovimientoInternoEntity, { nullable: true })
  @JoinColumn({ name: "movimiento_interno_id", referencedColumnName: "id" })
  @ManyToOne(() => MovimientoInternoEntity)
  @Expose()
  movimiento_interno: MovimientoInternoEntity;

  @Field(() => PoliticalAllianceEntity, { nullable: true })
  @JoinColumn({ name: "political_alliance_id", referencedColumnName: "id" })
  @ManyToOne(() => PoliticalAllianceEntity)
  @Expose()
  political_alliance: PoliticalAllianceEntity;

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  image_url: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  flag_url: string;

  @Field(() => CountryEntity, { nullable: true })
  @JoinColumn({ name: "country_id", referencedColumnName: "id" })
  @ManyToOne(() => CountryEntity)
  @Expose()
  country: CountryEntity;

  @Field(() => DepartmentEntity, { nullable: true })
  @JoinColumn({ name: "department_id", referencedColumnName: "id" })
  @ManyToOne(() => DepartmentEntity)
  @Expose()
  department: DepartmentEntity;

  @Field(() => MunicipalityEntity, { nullable: true })
  @JoinColumn({ name: "municipality_id", referencedColumnName: "id" })
  @ManyToOne(() => MunicipalityEntity)
  @Expose()
  municipality: MunicipalityEntity;
}
