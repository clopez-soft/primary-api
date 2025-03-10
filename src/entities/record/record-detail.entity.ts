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
import { RecordEntity } from "src/entities/record/record.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { CandidateEntity } from "src/entities/candidate.entity";
import { Slugify } from "src/helper/util";

@Entity("record_detail")
@Index(["record", "active"])
@Index(["record", "movimiento_interno"])
@Index(["record", "political_alliance"])
@Index(["record", "candidate"])
@Index(["record", "number_box"])
@ObjectType()
export class RecordDetailEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Field(() => RecordEntity, { nullable: true })
  @JoinColumn({ name: "record_id", referencedColumnName: "id" })
  @ManyToOne(() => RecordEntity)
  @Expose()
  record: RecordEntity;

  @Field(() => MovimientoInternoEntity, { nullable: true })
  @JoinColumn({ name: "movimiento_interno_id", referencedColumnName: "id" })
  @ManyToOne(() => MovimientoInternoEntity)
  @Expose()
  movimiento_interno: MovimientoInternoEntity;

  @Field(() => PoliticalAllianceEntity, { nullable: true })
  @JoinColumn({ name: "political_alliance_id", referencedColumnName: "id" })
  @ManyToOne(() => PoliticalAllianceEntity)
  @Expose()
  political_alliance: PoliticalAllianceEntity;

  @Field(() => CandidateEntity, { nullable: true })
  @JoinColumn({ name: "candidate_id", referencedColumnName: "id" })
  @ManyToOne(() => CandidateEntity)
  @Expose()
  candidate: CandidateEntity;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  number_box: number;

  @Column({ type: "numeric", nullable: false, default: 0 })
  @Field(() => Int, { nullable: false, defaultValue: 0 })
  @Expose()
  votes: number;
}
