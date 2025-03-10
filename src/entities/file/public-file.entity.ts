import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

@Entity("file_public")
@ObjectType()
export class PublicFileEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  @Expose()
  public id: number;

  @Column()
  @Field({ nullable: true })
  @Expose()
  public url: string;

  @Column()
  @Index()
  @Field({ nullable: true })
  @Expose()
  public key: string;
}
