import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { confirmEmailInput, RegisterUserInput } from "./dto/register.input";
import { UserSession } from "src/modules/authorization/session.decorator";
import { JwtAuthGuard } from "src/modules/auth/auth.guard";
import { UserEntity } from "src/entities/user.entity";

import { AuthService } from "./auth.service";
import { LoginStatusDto, SessionDto } from "./dto/session.dto";
import { LoginUserInput } from "./dto/login-user.input";
import {
  generatePasswordInput,
  resetPasswordConfirmInput,
  resetPasswordInput,
} from "./dto/reset-paswword.input";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity, { name: "me", nullable: true })
  me(@UserSession() session: SessionDto): Promise<UserEntity> {
    return this.authService.validateUser(session?.accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LoginStatusDto, { name: "session", nullable: true })
  sessionInfo(
    @UserSession() session: SessionDto
  ): Promise<LoginStatusDto | null> {
    return this.authService.session(session.accessToken, session.id);
  }

  @Mutation(() => LoginStatusDto, { name: "login", nullable: false })
  login(
    @Args("loginUserInput") input: LoginUserInput
  ): Promise<LoginStatusDto> {
    console.info("entro?");
    return this.authService.login(input);
  }

  @Mutation(() => Boolean, { name: "logout", nullable: true })
  logout(@UserSession() session: SessionDto): Promise<Boolean> {
    return this.authService.logout(session?.accessToken);
  }

  @Mutation(() => UserEntity, { name: "register", nullable: false })
  register(
    @UserSession() session: SessionDto,
    @Args("registerUserInput") input: RegisterUserInput
  ): Promise<UserEntity> {
    return this.authService.register(input, session);
  }

  @Mutation(() => LoginStatusDto, {
    name: "registerConfirmEmail",
    nullable: false,
  })
  confirmEmail(
    @Args("confirmEmailInput") input: confirmEmailInput
  ): Promise<LoginStatusDto> {
    return this.authService.confirmEmail(input);
  }

  @Mutation(() => String, { name: "resetPassword", nullable: false })
  resetPassword(
    @Args("resetPasswordInput") input: resetPasswordInput
  ): Promise<String> {
    return this.authService.resetPassword(input);
  }

  @Mutation(() => LoginStatusDto, {
    name: "resetPasswordConfirm",
    nullable: false,
  })
  resetPasswordConfirm(
    @Args("resetPasswordConfirmInput") input: resetPasswordConfirmInput
  ): Promise<LoginStatusDto> {
    return this.authService.resetPasswordConfirm(input);
  }

  @Mutation(() => String, { name: "generatePassword", nullable: false })
  generatePassword(
    @Args("input") input: generatePasswordInput
  ): Promise<string> {
    return this.authService.generatePassword(input);
  }
}
