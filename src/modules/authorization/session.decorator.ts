import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import { DecodeToken } from "src/helper/util";

export const UserSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionDto | null => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    const user = request.user;

    const auth = request.headers?.authorization;
    if (!auth) return null;

    const status = DecodeToken(auth);
    if (!status) return null;

    return {
      id: user?.id || status.id,
      email: user?.email || status.email,
      picture: user?.picure || status.picture,
      screen_name: status.screen_name,
      user_type: status.user_type,
      role: user?.role || status.role,
      exp: status.exp,
      accessToken: status.accessToken,
    };
  }
);
