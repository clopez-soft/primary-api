import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { RoleEntity } from "./role.entity";
import { BaseEntity } from "../base.entity";
import { Slugify } from "src/helper/util";

@Entity("sec_role_access")
@Index(["role", "access_code"])
@ObjectType()
export class RoleAccessEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Expose()
  @Column({ type: "varchar", length: 100, nullable: false, default: "" })
  @Field({ nullable: false })
  access_code: string;

  @Expose()
  @Field({ nullable: false })
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  @ManyToOne(() => RoleEntity)
  role: RoleEntity;
}
