import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose } from "class-transformer";

@Entity("base")
@Index(["id", "active"])
@Index(["slug", "active"])
@Index(["name", "active"])
@Index(["id", "deleted_at"])
@ObjectType()
export abstract class BaseEntity {
  @Field({ description: "row indentifier", nullable: false })
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  id: string;

  @Column({ type: "text", nullable: true, unique: false })
  @Field({ description: "Name", nullable: true })
  @Expose()
  name: string;

  @Column({ type: "text", nullable: true, unique: false })
  @Field({ description: "slug", nullable: true })
  @Expose()
  slug: string;

  @Field({ description: "Date the record was created" })
  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  @Expose()
  created_at: Date;

  @Field({ nullable: true, description: "User create the record" })
  @Column({ type: "uuid", nullable: true })
  @Expose()
  created_by: string;

  @Field({ nullable: true, description: "Date the record was updated" })
  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  @Expose()
  updated_at: Date;

  @Field({ nullable: true, description: "User delete the record" })
  @Column({ type: "uuid", nullable: true })
  @Expose()
  updated_by: string;

  // @Field({ nullable: true, description: 'Date the record was deleted' })
  @DeleteDateColumn({ nullable: true, type: "timestamptz" })
  @Exclude()
  deleted_at: Date;

  // @Field({ nullable: true, description: 'User delete the record' })
  @Column({ type: "uuid", nullable: true })
  @Exclude()
  deleted_by: string;

  // @Field({ nullable: false, defaultValue: true, description: 'Indicate whether the record is active for users' })
  @Column({ default: true, nullable: false, type: "boolean" })
  @Exclude()
  active: boolean;

  @VersionColumn()
  @Exclude()
  version: number;

  custom_slug: string;

  abstract updateSlug(): void;
  abstract createSlug(): void;
}
