import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { LoginDtoUserDto } from "../users/dto/login.dto";
import { Response, Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtservice: JwtService
  ) {}

  private async generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtservice.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtservice.sign(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new ConflictException("User with this email already exists.");
    }

    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  async login(loginDto: LoginDtoUserDto, res: Response) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Email or password is incorrect");
    }
    const confirmPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!confirmPassword) {
      throw new UnauthorizedException("Email or password is incorrect");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    user.refresh_token = hashedRefreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: "User logged in successfully",
      id: user.id,
      accessToken,
    };
  }

  async logout(refreshToken: string, res: Response) {
    const userData = this.jwtservice.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!userData) {
      throw new UnauthorizedException("User not verified");
    }

    const user = await this.usersService.findOne(userData.id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    user.refresh_token = "";
    await user.save();

    res.clearCookie("refreshToken");

    return { message: "User logged out successfully" };
  }

  async refreshToken(userId: number, refresh_token: string, res: Response) {
    const decodedToken = await this.jwtservice.decode(refresh_token);
    if (userId !== decodedToken["id"]) {
      throw new ForbiddenException("Unauthorized id");
    }

    const user = await this.usersService.findOne(userId);
    if (!user || !user.refresh_token) {
      throw new ForbiddenException("Unauthorized user");
    }

    const tokenMatch = await bcrypt.compare(refresh_token, user.refresh_token);
    if (!tokenMatch) {
      throw new ForbiddenException("Forbidden");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    user.refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: "User refreshed",
      userId: user.id,
      access_token: accessToken,
    };
  }
}
