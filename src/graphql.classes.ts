
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateUserInput {
    username: string;
    email: string;
    password: string;
}

export class LoginUserInput {
    username?: string;
    email?: string;
    password: string;
}

export class UpdateUserInput {
    username?: string;
    email?: string;
    password?: string;
    enabled?: boolean;
}

export class LoginResult {
    user: User;
    token: string;
}

export abstract class IMutation {
    abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;

    abstract updateUser(username: string, fieldsToUpdate: UpdateUserInput): User | Promise<User>;

    abstract addAdminPermission(username: string): User | Promise<User>;

    abstract removeAdminPermission(username: string): User | Promise<User>;

    abstract resetPassword(username: string, code: string, password: string): User | Promise<User>;
}

export abstract class IQuery {
    abstract login(user: LoginUserInput): LoginResult | Promise<LoginResult>;

    abstract refreshToken(username: string): string | Promise<string>;

    abstract users(): User[] | Promise<User[]>;

    abstract user(username?: string, email?: string): User | Promise<User>;

    abstract forgotPassword(email?: string): boolean | Promise<boolean>;
}

export class User {
    username: string;
    email: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    lastSeenAt: Date;
    enabled: boolean;
    _id: MongoObjectId;
}

export type Date = any;
export type MongoObjectId = any;
