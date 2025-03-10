import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JwtPayloadDto } from "src/modules/auth/dto/payload.dto";

import config from "src/config";
import { AuthService } from "./auth.service";

const cf = config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cf.JWT_SECRETKEY || "defaultSecretKey",
    });
  }

  async validate(payload: JwtPayloadDto) {
    const date = new Date(parseInt(payload["exp"]) * 1000);

    if (date < new Date()) return false;

    return this.userService.getById(payload.id);
  }
}
