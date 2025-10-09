import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Bot } from "./models/bot.model";
import { userInfo } from "os";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  // 🟢 /start komandasi
  async start(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await this.botModel.create({
          user_id,
          username: ctx.from?.username,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          language_code: ctx.from?.language_code,
        });

        await ctx.replyWithHTML(
          `Please press <b>📞 Share Contact</b> button`,
          Markup.keyboard([[Markup.button.contactRequest("📞 Share Contact")]])
            .oneTime()
            .resize()
        );
      } else if (!user.is_active) {
        await ctx.replyWithHTML(
          `Please share your contact again to activate your profile.`,
          Markup.keyboard([[Markup.button.contactRequest("📞 Share Contact")]])
            .oneTime()
            .resize()
        );
      } else {
        await ctx.reply(`
          
          You are already active!`);
      }
    } catch (error) {
      console.log("❌ Error in start:", error);
    }
  }

  // 📞 Foydalanuvchi kontakt yuborganda
  async onContact(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const contact = ctx.message?.["contact"];

      if (!contact) {
        return await ctx.reply(
          "⚠️ Please use the contact button to share your number."
        );
      }

      const phone = contact.phone_number;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        return await ctx.reply("❌ User not found. Please send /start again.");
      } else if (contact.user_id != user_id) {
        await ctx.replyWithHTML(
          `Please share your own contact`,
          Markup.keyboard([[Markup.button.contactRequest("📞 Share Contact")]])
            .oneTime()
            .resize()
        );
      } else {
        await this.botModel.update(
          {
            phone_number: phone[0] == "+" ? phone : "+" + phone,
            is_active: true,
          },
          { where: { user_id } }
        );

        await ctx.replyWithHTML(
          `Welcome! You are now active.`,
          Markup.removeKeyboard()
        );
      }
    } catch (error) {
      console.log("❌ Error on Contact:", error);
      await ctx.reply("Something went wrong. Please try again.");
    }
  }
}
