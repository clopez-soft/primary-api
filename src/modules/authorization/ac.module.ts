import {
  Module,
  DynamicModule,
  Global,
  Abstract,
  Type,
  ForwardReference,
} from "@nestjs/common";

import { RolesBuilder, ROLES_BUILDER_TOKEN } from "./ac-options";
import { AccessControlResolver } from "./ac.resolver";
import { AccessControlService } from "./ac.service";

@Global()
@Module({})
export class AccessControlModule {
  public static forRoles(roles: RolesBuilder): DynamicModule {
    return {
      module: AccessControlModule,
      providers: [
        AccessControlResolver,
        AccessControlService,
        { provide: ROLES_BUILDER_TOKEN, useValue: roles },
      ],
      exports: [
        AccessControlService,
        { provide: ROLES_BUILDER_TOKEN, useValue: roles },
      ],
    };
  }

  public static forRootAsync(options: {
    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
    useFactory: (...args: any) => RolesBuilder | Promise<RolesBuilder>;
    grantsEndpoint?: string;
  }): DynamicModule {
    const provider = {
      provide: ROLES_BUILDER_TOKEN,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      imports: [...(options.imports || [])],
      module: AccessControlModule,
      providers: [AccessControlResolver, AccessControlService, provider],
      exports: [AccessControlService, provider],
    };
  }
}
