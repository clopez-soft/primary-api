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
import { JrvEntity } from "src/entities/jrv/jrv.entity";
import { ELECTORAL_LEVEL } from "src/common/enums";
import { Slugify } from "src/helper/util";

@Entity("record")
@Index(["level", "active"])
@Index(["jrv", "level"])
@Index(["number", "level"])
@ObjectType()
export class RecordEntity extends BaseEntity {
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

  @Field(() => JrvEntity, { nullable: true })
  @JoinColumn({ name: "jrv_id", referencedColumnName: "id" })
  @ManyToOne(() => JrvEntity)
  @Expose()
  jrv: JrvEntity;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  number: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  electoral_weight: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  recibed_ballots: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  leftover_ballots: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  total_ballots: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  voters: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  jrv_votes: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  custodians: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  total_voters: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  valid_votes: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  void_votes: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  blank_votes: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  total_votes: number;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @Expose()
  observations: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Field({ nullable: true })
  @Expose()
  image_url: string;

  @Column({ type: "boolean", nullable: false, default: false })
  @Field({ nullable: false, defaultValue: false })
  @Expose()
  with_problems: boolean;

  @Column({ type: "text", array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  @Expose()
  problems: string[];
}
