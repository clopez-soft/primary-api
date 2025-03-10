import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { UserEntity } from "src/entities/user.entity";

import { RoleEntity } from "src/entities/security/role.entity";
import { SessionDto } from "src/modules/auth/dto/session.dto";
import {
  ComparePassword,
  GenerateConfirmCode,
  GeneratePassword,
} from "src/helper/util";
import { RegisterUserInput } from "src/modules/auth/dto/register.input";
import { ROLE_ACESS, USER_TYPE } from "src/common/enums";

import { ChangeRoleInput } from "./dto/change-role.input";
import { ChangePasswordInput } from "./dto/change-password.input";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}

  async findAll() {
    return this.userRepository.find({
      where: { active: true },
      relations: ["role"],
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email, active: true } });
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id, active: true } });
  }

  async findByIds(ids: string[], relations: string[] = []) {
    return this.userRepository.find({
      where: { id: In(ids), active: true },
      relations,
    });
  }

  async findRoleByCode(code: ROLE_ACESS) {
    return this.roleRepository.findOne({ where: { code, active: true } });
  }

  async findRolesByIds(ids: string[], relations: string[] = []) {
    if (!ids || !ids.length) return [];

    return this.roleRepository.find({
      where: { id: In(ids), active: true },
      relations,
    });
  }

  userTypes() {
    const arr = Object.values(USER_TYPE);
    return arr;
  }

  async updateAvatar(
    ssn: SessionDto,
    userId: string,
    url: string
  ): Promise<Boolean> {
    const result = await this.userRepository.update(
      { id: userId },
      { image_url: url, updated_by: ssn.id, updated_at: new Date() }
    );

    return (result.affected || 0) > 0;
  }

  private async updateUserActivity(userId: string) {
    try {
      //* this function is also called on the auth service
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

  async new_for(input: RegisterUserInput, session: SessionDto) {
    let role: RoleEntity | null = null;
    let userType: USER_TYPE = input.type;

    if (input._role) {
      role = await this.findRoleByCode(input._role);
    }

    const newRecord = this.userRepository.create(input);
    newRecord.name = (input.first_name || "") + " " + (input.last_name || "");
    newRecord.type = userType;
    if (role) newRecord.role = role;
    newRecord.image_url = "";
    newRecord.created_by = session?.id || "";
    newRecord.updated_by = session?.id || "";

    newRecord.pass_change_req = false;
    newRecord.pass_link_exp = new Date(0);
    newRecord.pass_token = "";

    newRecord.confirmed = false;
    newRecord.confirm_token = GenerateConfirmCode();

    return newRecord;
  }

  async changeRoleInput(input: ChangeRoleInput): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: input.userId, active: true },
    });
    if (!user) throw new NotFoundException("User not found");

    const role = await this.roleRepository.findOne({
      where: { code: input.roleId, active: true },
    });
    if (!role) throw new NotFoundException("Role not found");

    user.role = role;
    if (input.roleId !== ROLE_ACESS.VIEWER) user.type = USER_TYPE.END_USER;

    return this.userRepository.save(user);
  }

  async changePassword(
    session: SessionDto,
    input: ChangePasswordInput
  ): Promise<Boolean> {
    const user = await this.userRepository.findOne({
      where: { id: session.id, active: true },
    });
    if (!user) throw new NotFoundException("User not found");

    const equals = await ComparePassword(user.password, input.currentPassword);
    if (!equals)
      throw new NotFoundException(null, "The current password does not match.");

    user.password = await GeneratePassword(user.email, input.newPassword);
    await this.userRepository.save(user);
    this.updateUserActivity(session.id);
    return true;
  }
}
