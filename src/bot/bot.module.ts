import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { Botupdate } from "./bot.update";

@Module({
  controllers: [],
  providers: [BotService, Botupdate],
})
export class BotModule {}
