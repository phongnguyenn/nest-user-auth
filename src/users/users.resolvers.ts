import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { CreateUserInput, User, UpdateUserInput } from '../graphql.classes';
import { UsernameEmailGuard } from '../auth/guards/username-email.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserInputError, ValidationError } from 'apollo-server-core';

@Resolver('User')
export class UserResolver {
  constructor(private usersService: UsersService) {}

  @Query('getUsers')
  @UseGuards(GqlAuthGuard, AdminGuard)
  async getUsers() {
    return await this.usersService.getAllUsers();
  }

  @Query('user')
  @UseGuards(GqlAuthGuard, UsernameEmailGuard)
  async user(
    @Args('username') username?: string,
    @Args('email') email?: string,
  ): Promise<User> {
    let user: User | undefined;
    if (username) {
      user = await this.usersService.findOneByUsername(username);
    } else if (email) {
      user = await this.usersService.findOneByEmail(email);
    } else {
      // Is this the best exception for a graphQL error?
      throw new ValidationError('A username or email must be included');
    }

    if (user) return user;
    throw new UserInputError('The user does not exist');
  }

  // A NotFoundException is intentionally not sent so bots can't search for emails
  @Query('forgotPassword')
  async forgotPassword(@Args('email') email: string): Promise<void> {
    const worked = await this.usersService.forgotPassword(email);
  }

  // What went wrong is intentionally not sent (wrong username or code or user not in reset status)
  @Mutation('resetPassword')
  async resetPassword(
    @Args('username') username: string,
    @Args('code') code: string,
    @Args('password') password: string,
  ): Promise<User> {
    const user = await this.usersService.resetPassword(
      username,
      code,
      password,
    );
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @Mutation('createUser')
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const createdUser = await this.usersService.create(createUserInput);
    return createdUser;
  }

  @Mutation('updateUser')
  @UseGuards(GqlAuthGuard, UsernameEmailGuard)
  async updateUser(
    @Args('username') username: string,
    @Args('fieldsToUpdate') fieldsToUpdate: UpdateUserInput,
  ): Promise<User> {
    const user = await this.usersService.update(username, fieldsToUpdate);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @Mutation('addAdminPermission')
  @UseGuards(GqlAuthGuard, AdminGuard)
  async addAdminPermission(@Args('username') username: string): Promise<User> {
    const user = await this.usersService.addPermission('admin', username);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }

  @Mutation('removeAdminPermission')
  @UseGuards(GqlAuthGuard, AdminGuard)
  async removeAdminPermission(
    @Args('username') username: string,
  ): Promise<User> {
    const user = await this.usersService.removePermission('admin', username);
    if (!user) throw new UserInputError('The user does not exist');
    return user;
  }
}
