import { Entity, Column, BeforeInsert, BeforeUpdate, Index } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { BaseEntity } from "src/entities/base.entity";
import { ROLE_ACESS } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("sec_role")
@Index(["code", "active"])
@ObjectType()
export class RoleEntity extends BaseEntity {
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
    enum: ROLE_ACESS,
    nullable: false,
    default: ROLE_ACESS.VIEWER,
  })
  @Field({ nullable: false, defaultValue: ROLE_ACESS.VIEWER })
  @Expose()
  code: ROLE_ACESS;

  @Column({ type: "smallint", nullable: false, unique: true, default: 1 })
  @Field({ nullable: false, defaultValue: 1 })
  @Expose()
  access_level: number;

  @Column({ type: "varchar", length: 400, nullable: true })
  @Field({ nullable: true })
  @Expose()
  description: string;
}
