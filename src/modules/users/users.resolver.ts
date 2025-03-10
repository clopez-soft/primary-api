import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserEntity } from 'src/entities/user.entity';

import { ChangePasswordInput } from 'src/modules/users/dto/change-password.input';
import { UserSession } from 'src/modules/authorization/session.decorator';
import { SessionDto } from 'src/modules/auth/dto/session.dto';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { ACGuard } from 'src/modules/authorization/ac.guard';
import { UseRoles } from 'src/modules/authorization/ac-options';

import { ChangeRoleInput } from './dto/change-role.input';
import { UsersService } from './users.service';
import { USER_TYPE } from 'src/common/enums';

@Resolver(() => UserEntity)
@UseGuards(JwtAuthGuard)
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  @UseGuards(ACGuard)
  @UseRoles({ action: 'read', possession: 'any', resource: 'user' })
  @Query(() => [ UserEntity ], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: 'read', possession: 'any', resource: 'user-email' })
  @Query(() => UserEntity, { name: 'findUserByEmail', nullable: true })
  findByEmail(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: 'read', possession: 'any', resource: 'user_enums' })
  @Query(() => [ USER_TYPE ], { name: 'userEnums', nullable: false })
  getTypes() {
    return this.usersService.userTypes();
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: 'update', possession: 'any', resource: 'user-role' })
  @Mutation(() => UserEntity, { name: "changeRol" })
  changeRole(@Args('changeRoleInput') input: ChangeRoleInput) {
    return this.usersService.changeRoleInput(input);
  }

  @UseGuards(ACGuard)
  @UseRoles({ action: 'update', possession: 'own', resource: 'user-password' })
  @Mutation(() => Boolean, { name: "changePassword" })
  changePassword(@UserSession() session: SessionDto, @Args('changePasswordInput') input: ChangePasswordInput) {
    return this.usersService.changePassword(session, input);
  }
}
