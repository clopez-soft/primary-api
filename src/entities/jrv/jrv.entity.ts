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

import { BaseEntity } from "src/entities/base.entity";
import { VotingCenterEntity } from "src/entities/locations/voting-center.entity";
import { Slugify } from "src/helper/util";

@Entity("jrv")
@Index(["voting_center", "active"])
@Index(["number", "active"])
@ObjectType()
export class JrvEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Field(() => VotingCenterEntity, { nullable: true })
  @JoinColumn({ name: "voting_center_id", referencedColumnName: "id" })
  @ManyToOne(() => VotingCenterEntity)
  @Expose()
  voting_center: VotingCenterEntity;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  number: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  electoral_weight: number;
}
