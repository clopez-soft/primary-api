import { Entity, Column, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { BaseEntity } from "src/entities/base.entity";
import { ELECTORAL_LEVEL } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("political_alliance")
@Index(["code", "active"])
@Index(["level", "active"])
@ObjectType()
export class PoliticalAllianceEntity extends BaseEntity {
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

  @Column({ type: "text", array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  @Expose()
  movimientos_internos: string[];

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  image_url: string;
}
