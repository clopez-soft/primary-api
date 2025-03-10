import { Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { CountryEntity } from "src/entities/locations/country.entity";

@Entity("department")
@Index(["country", "active"])
@ObjectType()
export class DepartmentEntity extends CountryEntity {
  @Field(() => CountryEntity, { nullable: true })
  @JoinColumn({ name: "country_id", referencedColumnName: "id" })
  @ManyToOne(() => CountryEntity)
  @Expose()
  country: CountryEntity;
}
