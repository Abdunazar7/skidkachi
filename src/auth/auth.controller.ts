import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginDtoUserDto } from "../users/dto/login.dto";
import type { Response, Request } from "express";
import { UserAuthGuard } from "../common/guards/user-auth.guard";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() loginDto: LoginDtoUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(loginDto, res);
  }

  @HttpCode(200)
  @Post("logout")
  logout(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({passthrough: true}) res: Response
  ) {
    return this.authService.logout(refreshToken, res)
  }

  @HttpCode(200)
  @Post("/:id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({passthrough: true}) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }

}
