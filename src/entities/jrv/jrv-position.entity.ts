import { Entity, Column, Index, BeforeUpdate, BeforeInsert } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { BaseEntity } from "src/entities/base.entity";
import { JRV_POSITION_TYPE } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("jrv_position")
@Index(["code", "active"])
@Index(["type", "active"])
@ObjectType()
export class JrvPositionEntity extends BaseEntity {
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
    enum: JRV_POSITION_TYPE,
    nullable: false,
    default: JRV_POSITION_TYPE.PRESIDENT,
  })
  @Field(() => JRV_POSITION_TYPE, {
    nullable: false,
    defaultValue: JRV_POSITION_TYPE.PRESIDENT,
  })
  @IsEnum(JRV_POSITION_TYPE)
  @Expose()
  type: JRV_POSITION_TYPE;
}
