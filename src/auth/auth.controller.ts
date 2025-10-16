import { Body, Controller, Param, ParseIntPipe, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login.dto';
import type { Response } from 'express';
import { CookieGetter } from '../common/decorators/cookie-getter.decorat';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("registration")
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @Post("login")
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(loginUserDto, res);
  }

  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refreshToken:string,
    @Res({passthrough:true}) res: Response
  ) {
    return this.authService.logout(refreshToken,res);
  }

  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({passthrough :true}) res:Response
  ){
    return this.authService.refreshToken(id, refreshToken, res)
  }
}
