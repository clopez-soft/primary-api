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
import { BallotEntity } from "src/entities/ballot/ballot.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { Slugify } from "src/helper/util";

@Entity("ballot_detail")
@Index(["ballot", "active"])
@Index(["movimiento_interno", "active"])
@Index(["political_alliance", "active"])
@Index(["sequence", "active"])
@ObjectType()
export class BallotDetailEntity extends BaseEntity {
  @BeforeUpdate()
  updateSlug() {
    this.slug = Slugify(this.name);
  }

  @BeforeInsert()
  createSlug() {
    this.slug = Slugify(this.name);
  }

  @Field(() => BallotEntity, { nullable: true })
  @JoinColumn({ name: "ballot_id", referencedColumnName: "id" })
  @ManyToOne(() => BallotEntity)
  @Expose()
  ballot: BallotEntity;

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

  @Column({ type: "numeric", nullable: false, default: 1 })
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  @Expose()
  sequence: number;
}
