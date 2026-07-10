import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const role = await this.usersService.findRoleByCode('WAREHOUSE');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      passwordHash,
      roleId: role.id,
    });

    const { passwordHash: removedPasswordHash, ...result } = user;

    void removedPasswordHash;

    return result;
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
      }),
    };
  }
}
