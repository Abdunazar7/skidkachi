import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BotService } from "./bot.service";
import { Botupdate } from "./bot.update";
import { Bot } from "./models/bot.model";

@Module({
  imports: [SequelizeModule.forFeature([Bot])],
  controllers: [],
  providers: [BotService, Botupdate],
})
export class BotModule {}
