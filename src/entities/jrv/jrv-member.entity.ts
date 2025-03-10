import {
  Entity,
  Column,
  Index,
  BeforeUpdate,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { BaseEntity } from "src/entities/base.entity";
import { JrvPositionEntity } from "src/entities/jrv/jrv-position.entity";
import { JrvEntity } from "src/entities/jrv/jrv.entity";
import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";
import { PoliticalAllianceEntity } from "src/entities/political-alliance.entity";
import { Slugify } from "src/helper/util";

@Entity("jrv_member")
@Index(["jrv", "active"])
@Index(["position", "active"])
@ObjectType()
export class JrvMemberEntity extends BaseEntity {
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
  dni: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @Expose()
  description: string;

  @JoinColumn({ name: "jrv_id", referencedColumnName: "id" })
  @ManyToOne(() => JrvEntity, { nullable: false })
  @Expose()
  jrv: JrvEntity;

  @Field(() => JrvPositionEntity, { nullable: true })
  @JoinColumn({ name: "position_id", referencedColumnName: "id" })
  @ManyToOne(() => JrvPositionEntity)
  @Expose()
  position: JrvPositionEntity;

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
}
