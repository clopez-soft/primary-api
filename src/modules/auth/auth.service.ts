import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { plainToClass } from "class-transformer";

import { UserEntity } from "src/entities/user.entity";
import { TokenEntity } from "src/entities/security/token.entity";
import { LuxonService } from "src/helper/luxon-service";

import {
  ComparePassword,
  GetToken,
  DecodeToken,
  GeneratePassword,
  GenerateConfirmCode,
  Gen_v4,
  toSafeString,
} from "src/helper/util";
import { DATE_DIFF, ROLE_ACESS, USER_TYPE } from "src/common/enums";

import { CustomException } from "src/custom/save-db.exception";
import { RoleEntity } from "src/entities/security/role.entity";

import { LoginStatusDto, SessionDto } from "./dto/session.dto";
import { LoginUserInput } from "./dto/login-user.input";
import { JwtPayloadDto } from "./dto/payload.dto";
import { confirmEmailInput, RegisterUserInput } from "./dto/register.input";
import {
  generatePasswordInput,
  resetPasswordConfirmInput,
  resetPasswordInput,
} from "./dto/reset-paswword.input";
import { UserContextDto } from "./dto/user-context.dto";
import { AccessControlService } from "../authorization/ac.service";
import { PermissionDto } from "../authorization/permission.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(TokenEntity)
    private readonly tokenRepo: Repository<TokenEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    private readonly jwtService: JwtService,
    private readonly acService: AccessControlService
  ) {}

  decodeToken(data: any): SessionDto {
    const session = DecodeToken(data);

    if (!session) throw new UnauthorizedException(null, "Invalid token");

    return session;
  }

  isValidSession(session: SessionDto): boolean {
    if (!session.accessToken) return false;

    const date = new Date(session.exp * 1000);

    if (date < new Date()) return false;

    return true;
  }

  private saveSessionToken(token: string) {
    const tk = this.tokenRepo.create({
      active: true,
      token_id: Gen_v4(),
      token: token,
    });
    this.tokenRepo.save(tk);
  }

  async validateUser(token: string): Promise<UserEntity> {
    var info = this.decodeToken(token);
    if (!info || !info.id) return {} as UserEntity;

    const user = await this.userRepository.findOne({
      where: { id: info.id, confirmed: true, active: true },
      relations: ["role"],
    });

    const result = plainToClass(UserEntity, user, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async getById(userId: string): Promise<UserContextDto> {
    const cacheId = "user_" + userId;
    const user = await this.userRepository.findOne({
      relations: ["role"],
      where: { id: userId, active: true },
      cache: { id: cacheId, milliseconds: 3000 },
    });

    if (user) {
      if (!user.confirmed)
        throw new NotFoundException(
          "You must confirm your email before performing this action."
        );

      this.updateUserActivity(userId);
      const { id, name, email, type, role } = user;

      //Pass only needed params to the guards
      return {
        id,
        name,
        email,
        type,
        role: role?.code || ROLE_ACESS.VIEWER,
      };
    }

    throw new NotFoundException(
      "Your session is outdated. Please try signing in again."
    );
  }

  private async updateUserActivity(userId: string) {
    try {
      //* this function is also called on the users service
      const result = await this.userRepository.update(
        { id: userId },
        { last_active: new Date() }
      );

      return (result.affected || 0) > 0;
    } catch (error) {
      console.log(` 🔥 updateUserActivity  `, error);
      return false;
    }
  }

  private async loginInfo(user: UserEntity): Promise<JwtPayloadDto> {
    let screen_name = user.name || user.email?.split("@")[0] || "";

    const { id, email, name, role } = user;

    return {
      id,
      email,
      role: role?.code || ROLE_ACESS.VIEWER,
      screen_name: screen_name || name,
      picture: user.image_url || "",
      user_type: user.type,
    };
  }

  async session(
    accessToken: string,
    userId: string
  ): Promise<LoginStatusDto | null> {
    const cacheId = "session_" + userId;
    const user = await this.userRepository.findOne({
      relations: ["role"],
      where: { id: userId, active: true },
      cache: { id: cacheId, milliseconds: 3000 },
    });

    if (!user) throw new CustomException(null, "Invalid session", true);

    const payload = await this.loginInfo(user);
    const token = this.jwtService.sign(payload);
    const exp = this.decodeToken(token).exp;

    const session: SessionDto = {
      ...payload,
      accessToken,
      exp: exp,
    };

    return {
      session,
      permissions:
        this.acService.getPermissions(session) || ({} as PermissionDto),
    };
  }

  async login(input: LoginUserInput): Promise<LoginStatusDto> {
    try {
      //const user = await this.userRepository.findOne({ email: input.email, active: true });
      const user = await this.userRepository.findOne({
        relations: ["role"],
        where: { email: input.email, active: true },
      });

      if (!user)
        throw new CustomException(null, "Wrong credentials provided.", true);

      const passCombination = user.email + "_" + input.password;
      const equals = await ComparePassword(user.password, passCombination);
      if (!equals)
        throw new CustomException(null, "Wrong credentials provided..", true);

      if (!user.confirmed)
        throw new CustomException(
          null,
          "You must confirm your email before performing this action.",
          true
        );

      const payload = await this.loginInfo(user);
      const token = this.jwtService.sign(payload);
      const exp = this.decodeToken(token).exp;

      this.saveSessionToken(token);
      this.updateUserActivity(user.id);

      const session: SessionDto = {
        ...payload,
        accessToken: token,
        exp: exp,
      };

      return {
        session,
        permissions:
          this.acService.getPermissions(session) || ({} as PermissionDto),
      };
    } catch (error) {
      throw new BadRequestException(error, "Failed at login");
    }
  }

  async logout(jwt: string): Promise<Boolean> {
    try {
      if (!jwt) return false;

      jwt = GetToken(jwt);

      const decode = this.jwtService.decode(jwt) as SessionDto;
      if (!decode) return false;

      this.updateUserActivity(decode.id);
      return true;
    } catch (error) {
      throw new BadRequestException(error, "Error at logout");
    }
  }

  async register(
    input: RegisterUserInput,
    session: SessionDto
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: input.email, active: true },
      });
      if (user) throw new ConflictException("Email already registered.");

      const role = await this.roleRepo.findOne({
        where: { code: ROLE_ACESS.VIEWER, active: true },
      });

      const newRecord = this.userRepository.create(input);
      newRecord.name = (input.first_name || "") + " " + (input.last_name || "");
      newRecord.type = USER_TYPE.END_USER;
      if (role) newRecord.role = role;
      newRecord.image_url = "";
      newRecord.created_by = session?.id || "";
      newRecord.updated_by = session?.id || "";
      newRecord.confirmed = false;
      newRecord.confirm_token = GenerateConfirmCode();

      const savedItem = await this.userRepository.save(newRecord);
      //this.mailService.sendUserConfirmation({ name: newRecord.name, email: newRecord.email, token: newRecord.confirm_token });

      return plainToClass(UserEntity, savedItem, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException(error, "Error at logout");
    }
  }

  async confirmEmail(input: confirmEmailInput): Promise<LoginStatusDto> {
    const user = await this.userRepository.findOne({
      where: { email: input.email, confirm_token: input.token, active: true },
      relations: ["role"],
    });
    if (!user)
      throw new CustomException(
        null,
        "Email not found or invalid confirmation code.",
        true
      );

    user.confirmed = true;
    user.confirm_token = "";

    await this.userRepository.save(user);

    const payload = await this.loginInfo(user);
    const token = this.jwtService.sign(payload);
    const exp = this.decodeToken(token).exp;

    this.saveSessionToken(token);

    const session: SessionDto = {
      ...payload,
      accessToken: token,
      exp: exp,
    };

    return {
      session,
      permissions:
        this.acService.getPermissions(session) || ({} as PermissionDto),
    };
  }

  async resetPassword(input: resetPasswordInput): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: input.email, active: true },
    });
    if (!user) throw new NotFoundException("User not found");

    const days = 2;

    user.pass_link_exp = LuxonService.transformFromNow(
      days,
      DATE_DIFF.DAY
    ).toJSDate();
    user.pass_token = GenerateConfirmCode();
    user.pass_change_req = true;

    await this.userRepository.save(user);
    const msg = `We have sent an email with a confirmation link to your email address. This one lasts ${days} days since now.`;
    //this.mailService.sendResetPasswordRequest({ name: user.name, msg, email: user.email, code: user.pass_token });
    return msg;
  }

  async generatePassword(input: generatePasswordInput): Promise<string> {
    const password = await GeneratePassword(input.email, input.password);
    return toSafeString(password);
  }

  async resetPasswordConfirm(
    input: resetPasswordConfirmInput
  ): Promise<LoginStatusDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: input.email,
        pass_token: input.token,
        pass_change_req: true,
        active: true,
      },
      relations: ["role"],
    });

    if (!user)
      throw new NotFoundException("The email or recovery code is not valid.");

    user.pass_link_exp = new Date(0);
    user.pass_token = "";
    user.pass_change_req = false;
    user.password = await GeneratePassword(input.email, input.newPassword);

    await this.userRepository.save(user);

    const payload = await this.loginInfo(user);
    const token = this.jwtService.sign(payload);
    const exp = this.decodeToken(token).exp;

    this.saveSessionToken(token);
    //this.mailService.sendPasswordChanged({ email: user.email, name: user.name });

    const session: SessionDto = {
      ...payload,
      accessToken: token,
      exp: exp,
    };

    return {
      session,
      permissions:
        this.acService.getPermissions(session) || ({} as PermissionDto),
    };
  }
}
