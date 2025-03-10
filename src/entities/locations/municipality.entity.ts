import { Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

import { CountryEntity } from "src/entities/locations/country.entity";
import { DepartmentEntity } from "src/entities/locations/department.entity";

@Entity("municipality")
@Index(["department", "active"])
@ObjectType()
export class MunicipalityEntity extends CountryEntity {
  @Field(() => DepartmentEntity, { nullable: true })
  @JoinColumn({ name: "department_id", referencedColumnName: "id" })
  @ManyToOne(() => DepartmentEntity)
  @Expose()
  department: DepartmentEntity;
}
