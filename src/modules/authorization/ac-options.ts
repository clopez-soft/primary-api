import { Inject } from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import { AccessControl } from "accesscontrol";

export enum Action {
  // Manage = 'manage',
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  // View = 'view',
}

export enum Possession {
  own = "own",
  any = "any",
}

export interface ACOptions {
  grantsEndpoint?: string;
}

export interface Role {
  resource?: string;
  action?: "create" | "read" | "update" | "delete";
  possession?: "own" | "any";
}

export const ROLES_BUILDER_TOKEN = "__roles_builder__";
export const InjectRolesBuilder = () => Inject(ROLES_BUILDER_TOKEN);
export class RolesBuilder extends AccessControl {}
export const actions = Object.keys(Action);
export const possessions = Object.keys(Possession);
export const UseRoles = (...roles: Role[]) => SetMetadata("roles", roles);
