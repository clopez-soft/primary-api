import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "src/entities/user.entity";
import { RoleEntity } from "src/entities/security/role.entity";
import { TokenEntity } from "src/entities/security/token.entity";

import config from "src/config";
//import { MailModule } from 'src/modules/mail/mail.module';
import { AccessControlModule } from "src/modules/authorization/ac.module";

import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./jwt.strategy";

const cf = config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity, RoleEntity]),
    JwtModule.register({
      secret: cf.JWT_SECRETKEY,
      signOptions: { expiresIn: cf.JWT_EXPIRES_IN },
    }),
    //MailModule,
    AccessControlModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
