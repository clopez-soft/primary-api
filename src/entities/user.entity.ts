import {
  Entity,
  BeforeInsert,
  Column,
  JoinColumn,
  Unique,
  ManyToOne,
  BeforeUpdate,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose } from "class-transformer";

import { BaseEntity } from "src/entities/base.entity";
import { RoleEntity } from "./security/role.entity";

import { GeneratePassword, Slugify } from "src/helper/util";
import { ROLE_ACESS, USER_TYPE } from "src/common/enums";

@Entity("user")
@Unique(["email", "active"])
@ObjectType()
export class UserEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Column({ type: "varchar", length: 400, nullable: false })
  @Field({ nullable: false })
  @Expose()
  email: string;

  @Column({ type: "varchar", length: 400, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: "boolean", nullable: false, default: false })
  @Field({ nullable: true, defaultValue: false })
  @Expose()
  confirmed: boolean;

  @Column({ type: "varchar", length: 40, nullable: true, default: "" })
  @Expose()
  confirm_token: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  image_url: string;

  @Column({
    type: "enum",
    enum: USER_TYPE,
    nullable: false,
    default: USER_TYPE.END_USER,
  })
  @Field({
    nullable: false,
    defaultValue: USER_TYPE.END_USER,
    description: "Default access will be given in accordance to the user type",
  })
  @Expose()
  type: USER_TYPE;

  @Column({ type: "timestamptz", nullable: true })
  pass_link_exp: Date;

  @Column({ type: "varchar", length: 40, nullable: true, default: "" })
  pass_token: string;

  @Column({ type: "boolean", nullable: false, default: false })
  pass_change_req: boolean;

  @Field({ nullable: true, description: "Last time the user made an activity" })
  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  last_active: Date;

  @Field({ nullable: true })
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  @Expose()
  @ManyToOne(() => RoleEntity, { nullable: true })
  role: RoleEntity;

  @Expose()
  @Field(() => ROLE_ACESS, { nullable: true })
  get roleCode() {
    if (this.role?.code) {
      return this.role.code;
    }

    return null;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await GeneratePassword(this.email, this.password);
  }
}
