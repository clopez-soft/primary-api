import {
  Entity,
  PrimaryColumn,
  VersionColumn,
  Unique,
  Column,
  Index,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

@Entity("sec_permission")
@Unique(["access_code", "parent_id", "active"])
@Index(["access_code", "active"])
@ObjectType()
export class PermissionEntity {
  @Expose()
  @PrimaryColumn({ type: "varchar", length: 100, nullable: false, default: "" })
  @Field({ nullable: false })
  id: string;

  @Expose()
  @Column({ type: "varchar", length: 1000, nullable: false, default: "" })
  @Field({ nullable: false })
  access_code: string;

  @Expose()
  @Column({ type: "varchar", length: 100, nullable: false, default: "" })
  @Field({ nullable: false })
  description: string;

  @Expose()
  @Column({ type: "varchar", length: 100, nullable: true, default: "" })
  @Field({ nullable: true })
  parent_id: string;

  @Column({ default: true, nullable: false, type: "boolean" })
  @Field({ nullable: false, defaultValue: true })
  active: boolean;

  @VersionColumn()
  @Field({ nullable: false, defaultValue: 0 })
  version: number;
}
