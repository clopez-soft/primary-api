import { Entity, Column, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { BaseEntity } from "src/entities/base.entity";
import { Slugify } from "src/helper/util";

@Entity("country")
@Index(["code", "active"])
@ObjectType()
export class CountryEntity extends BaseEntity {
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
  electoral_weight: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  number_jrv: number;
}
