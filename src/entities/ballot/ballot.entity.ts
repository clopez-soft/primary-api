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
import { CountryEntity } from "src/entities/locations/country.entity";
import { DepartmentEntity } from "src/entities/locations/department.entity";
import { MunicipalityEntity } from "src/entities/locations/municipality.entity";
import { ELECTORAL_LEVEL } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("ballot")
@Index(["level", "active"])
@Index(["country", "level"])
@Index(["department", "level"])
@Index(["municipality", "level"])
@ObjectType()
export class BallotEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

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

  @Column({ type: "numeric", nullable: false, default: 1 })
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  @Expose()
  marks: number;
}
