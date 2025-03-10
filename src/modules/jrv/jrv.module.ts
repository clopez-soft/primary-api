import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JrvEntity } from "src/entities/jrv/jrv.entity";

import { JrvService } from "./jrv.service";
import { JrvResolver } from "./jrv.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([JrvEntity])],
  providers: [JrvService, JrvResolver],
  exports: [JrvService],
})
export class JrvModule {}
