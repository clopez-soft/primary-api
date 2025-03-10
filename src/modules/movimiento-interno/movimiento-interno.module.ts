import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MovimientoInternoEntity } from "src/entities/movimiento-interno.entity";

import { MovimientoInternoService } from "./movimiento-interno.service";
import { MovimientoInternoResolver } from "./movimiento-interno.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInternoEntity])],
  providers: [MovimientoInternoService, MovimientoInternoResolver],
  exports: [MovimientoInternoService],
})
export class MovimientoInternoModule {}
