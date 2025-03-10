import { Entity, Column, Unique, PrimaryColumn } from "typeorm";
@Entity("sec_token")
@Unique(["token_id", "active"])
export class TokenEntity {
  @PrimaryColumn({ nullable: false, type: "varchar", length: 40 })
  token_id: string;

  @Column({ nullable: false, type: "varchar", length: 2000 })
  token: string;

  @Column({ nullable: false, type: "boolean", default: true })
  active: boolean;
}
