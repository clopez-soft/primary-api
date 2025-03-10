import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserSession } from "src/modules/authorization/session.decorator";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { UseRoles } from "src/modules/authorization/ac-options";
import { ACGuard } from "src/modules/authorization/ac.guard";

import { DepartmentEntity } from "src/entities/locations/department.entity";

import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "./dto/department.input";
import { DepartmentService } from "./department.service";

@Resolver(() => DepartmentEntity)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "department" })
  @Query(() => [DepartmentEntity], { name: "departments", nullable: true })
  findAll(@UserSession() ssn: SessionDto) {
    return this.departmentService.findAll(ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "department" })
  @Query(() => DepartmentEntity, { name: "departmentById", nullable: true })
  findById(@Args("id", { type: () => String }) id: string) {
    return this.departmentService.findById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "read", possession: "any", resource: "department" })
  @Query(() => DepartmentEntity, { name: "departmentBySlug", nullable: true })
  findBySlug(@Args("slug", { type: () => String }) slug: string) {
    return this.departmentService.findBySlug(slug);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "create", possession: "any", resource: "department" })
  @Mutation(() => DepartmentEntity)
  createDepartment(
    @Args("input") input: CreateDepartmentInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.departmentService.create(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "update", possession: "any", resource: "department" })
  @Mutation(() => DepartmentEntity)
  updateDepartment(
    @Args("input") input: UpdateDepartmentInput,
    @UserSession() ssn: SessionDto
  ) {
    return this.departmentService.update(input, ssn);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: "delete", possession: "any", resource: "department" })
  @Mutation(() => [String])
  removeDepartment(
    @Args("id", { type: () => String }) id: string,
    @UserSession() ssn: SessionDto
  ): Promise<string[]> {
    return this.departmentService.remove(id, ssn);
  }
}
