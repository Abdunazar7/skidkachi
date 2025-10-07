import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule,
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
