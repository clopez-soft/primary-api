import { Injectable } from "@nestjs/common";
import {
  RolesBuilder,
  InjectRolesBuilder,
  actions,
  possessions,
} from "src/modules/authorization/ac-options";

import { ROLE_ACESS, SPECIAL_PERMISSION } from "src/common/enums";
import { menu } from "src/modules/authorization/app.menu";
import { SessionDto } from "src/modules/auth/dto/session.dto";

import { PermissionDto } from "./permission.dto";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
  ) {}

  private getGrantedActionsFor({
    roles,
    resources = [],
  }: {
    roles: string[];
    resources: string[];
  }) {
    if (!Array.isArray(roles)) roles = [roles];

    if (!Array.isArray(resources)) resources = [resources];

    const list = {};

    var role = roles;

    for (var i = 0; i < resources.length; i++) {
      var resource = resources[i].toLowerCase();

      list[resource] = {};

      for (var j = 0; j < actions.length; j++) {
        var action = actions[j].toLowerCase();

        list[resource][action] = {};

        for (var k = 0; k < possessions.length; k++) {
          var possession = possessions[k];

          const q = Object.assign(
            {},
            {
              role,
              resource,
              action,
              possession,
            }
          );

          list[resource][action][possession] =
            this.roleBuilder.permission(q).granted;
        }
      }
    }

    return list;
  }

  private generateCuratedList = (list = {}) => {
    const curetedlist = {};
    const props = Object.keys(list);

    props.forEach((k) => {
      const kl = k.toLowerCase();
      // console.log(`forEach 🔥 : `, kl);

      const resource = list[`${kl}`];
      // console.log(` resource : `, resource);

      actions.forEach((a) => {
        const al = a.toLowerCase();
        let counter = 0;
        possessions.forEach((p) => {
          const pl = p.toLowerCase();
          if (resource[al][pl]) {
            counter++;
          }
        });

        if (counter > 0) {
          // console.log(`🐛  counter for ` + kl + '.' + al, counter);
          curetedlist[kl] ||= {};
          curetedlist[kl][al] ||= {};
          curetedlist[kl][al] = resource[al];
        }
      });
    });

    return curetedlist;
  };

  getPermissions(ssn: SessionDto): PermissionDto | null {
    const myMenu = menu.filter((m) => m.role === ssn.role);
    const grants = this.roleBuilder.getGrants();
    if (!grants) return null;

    const list = this.getGrantedActionsFor({
      roles: [ssn.role],
      resources: this.roleBuilder.getResources(),
    });
    const curated = this.generateCuratedList(list);
    return {
      actions: curated,
      menu:
        myMenu?.length > 0
          ? myMenu[0].menu.map((m) => {
              const mm: { inherit?: any } = { ...m };
              delete mm.inherit;
              return mm;
            })
          : [],
    };
  }

  hasPermission(
    action: "read" | "create" | "update" | "delete",
    permission: string,
    ssn: SessionDto,
    cb: () => boolean | undefined
  ): boolean {
    switch (action) {
      case "read":
        if (this.roleBuilder.can(ssn.role).readAny(permission).granted)
          return true;

        return cb ? !!cb() : false;
      case "create":
        if (this.roleBuilder.can(ssn.role).createAny(permission).granted)
          return true;

        return cb ? !!cb() : false;
      case "update":
        if (this.roleBuilder.can(ssn.role).updateAny(permission).granted)
          return true;

        return cb ? !!cb() : false;
      case "delete":
        if (this.roleBuilder.can(ssn.role).deleteAny(permission).granted)
          return true;

        return cb ? !!cb() : false;
      default:
        return false;
    }
  }

  special_permissions() {
    const arr = Object.values(SPECIAL_PERMISSION);
    return arr;
  }

  roleTypes() {
    const arr = Object.values(ROLE_ACESS);
    return arr;
  }
}
