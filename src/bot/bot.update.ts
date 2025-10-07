import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { BotService } from "./bot.service"
import { Context } from "telegraf";

@Update()
export class Botupdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx:Context){
    ctx.reply("Yangi Yiling Bilan Megajin");
  }

  @On("text")
  async OnText(@Ctx() ctx:Context){
    // console.log(ctx)
    if("text" in ctx.message!){
      if(ctx.message.text=="hello"){
        await ctx.replyWithHTML("<b>Salom</b>");
      } else {
        await ctx.replyWithHTML(ctx.message.text)
      }
    }
  }



}
