import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "src/entities/user.entity";
import { RoleEntity } from "src/entities/security/role.entity";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
