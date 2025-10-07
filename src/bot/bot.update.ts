import { Ctx, Start, Update } from "nestjs-telegraf";
import { BotService } from "./bot.service"
import { Context } from "telegraf";

@Update()
export class Botupdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx:Context){
    ctx.reply("Yangi Yiling Bilan Megajin");
  }

}
