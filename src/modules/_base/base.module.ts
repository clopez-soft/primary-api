import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BaseEntity } from "src/entities/base.entity";

import { BaseService } from "./base.service";
import { BaseResolver } from "./base.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity])],
  providers: [BaseResolver, BaseService],
  exports: [BaseService],
})
export class BaseModule {}
