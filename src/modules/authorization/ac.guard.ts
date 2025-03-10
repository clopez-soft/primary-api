import { IQueryInfo } from "accesscontrol";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Role, RolesBuilder, InjectRolesBuilder } from "./ac-options";
import { UserContextDto } from "../auth/dto/user-context.dto";

@Injectable()
export class ACGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  protected async getUser(context: ExecutionContext): Promise<UserContextDto> {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    const user = request?.user;
    return user || null;
  }

  protected async getUserRoles(
    context: ExecutionContext
  ): Promise<string | string[]> {
    const user = await this.getUser(context);
    if (!user)
      throw new UnauthorizedException(
        "Insufficient privileges to access the target resource."
      );

    return user.role;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>("roles", context.getHandler());

    if (!roles) {
      return true;
    }

    const userRoles = await this.getUserRoles(context);

    const hasRoles = roles.every((role) => {
      const queryInfo: IQueryInfo = role;
      queryInfo.role = userRoles;
      const permission = this.roleBuilder.permission(queryInfo);
      return permission.granted;
    });

    return hasRoles;
  }
}
