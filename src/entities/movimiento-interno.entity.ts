import { Entity, Column, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { BaseEntity } from "src/entities/base.entity";
import { Slugify } from "src/helper/util";

@Entity("movimiento_interno")
@Index(["code", "active"])
@ObjectType()
export class MovimientoInternoEntity extends BaseEntity {
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

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  image_url: string;
}
