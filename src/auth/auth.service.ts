import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login.dto';
import bcrypt from "bcrypt"
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtservice: JwtService
  ) {}

  private async genereteTokens(user: User) {
    const paylod = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };
    const [accsessToken, refreshToken] = await Promise.all([
      this.jwtservice.sign(paylod, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtservice.sign(paylod, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { accsessToken, refreshToken };
  }

  async registration(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new ConflictException("Bunday foydalanuvchi majud");
    }
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  async login(loginUserDto: LoginUserDto, res:Response) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException("Parol yoki email notog'ri");
    }
    const confirmPassword = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );
    if (!confirmPassword) {
      throw new UnauthorizedException("Parol yoki email notog'ri");
    }

    const {accsessToken, refreshToken} = await this.genereteTokens(user)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7)
    user.refresh_token = hashedRefreshToken
    await user.save()

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true
    });
    
    return{
        message: "Toriga otin",
        id: user.id,
        accsessToken
    }
  }

  async logout (refreshToken: string, res:Response){
    const userDate = await this.jwtservice.verify(refreshToken, {
      secret: process.env.REFRESH_sECTER_KEy
    });
    if(!userDate){
      throw new ForbiddenException("User not varified")
    }
    const user = await this.usersService.findOne(userDate.id)
    if(!user){
      throw new BadRequestException("Notog'ri token")
    }
    user.refresh_token = ""
    await user.save()

    res.clearCookie("refreshToken")
    return {
      message: "User Loged out"
    }

  }

  async refreshToken(userId: number, refresh_token: string, res:Response){
    const decodToken = await this.jwtservice.decode(refresh_token)


    if(userId !== decodToken["id"]){
      throw new ForbiddenException("Ruxsat erilmagan id")
    }
    const user = await this.usersService.findOne(userId)

    if(!user || !user.refresh_token){
      throw new ForbiddenException("Foribbden")
    }

    const  {accsessToken, refreshToken} = await  this.genereteTokens(user)
    user.refresh_token = await bcrypt.hash(refreshToken, 7)
    await user.save()

    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true
    });
    return {
      message: "User refreshed",
      userId: user.id,
      accsessToken
    }
  }

}
