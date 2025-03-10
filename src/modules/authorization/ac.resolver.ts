import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";

import { UserSession } from "src/modules/authorization/session.decorator";
import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { ROLE_ACESS, SPECIAL_PERMISSION } from "src/common/enums";

import { AccessControlService } from "./ac.service";
import { PermissionDto } from "./permission.dto";
import { ACGuard } from "./ac.guard";
import { UseRoles } from "./ac-options";

@Resolver()
export class AccessControlResolver {
  constructor(private readonly acService: AccessControlService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PermissionDto, { name: "permissions", nullable: true })
  getPermissions(@UserSession() session: SessionDto): PermissionDto | null {
    return this.acService.getPermissions(session);
  }

  @UseGuards(ACGuard)
  @UseGuards(JwtAuthGuard)
  @UseRoles({ action: "read", possession: "any", resource: "role_enums" })
  @Query(() => [ROLE_ACESS], { name: "roleEnums", nullable: false })
  getTypes() {
    return this.acService.roleTypes();
  }

  @UseGuards(ACGuard)
  @UseGuards(JwtAuthGuard)
  @UseRoles({
    action: "read",
    possession: "any",
    resource: "special_permissions_enums",
  })
  @Query(() => [SPECIAL_PERMISSION], {
    name: "special_permissions_enums",
    nullable: false,
  })
  special_permissions() {
    return this.acService.special_permissions();
  }
}
