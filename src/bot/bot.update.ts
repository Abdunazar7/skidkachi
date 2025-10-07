import { Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { BotService } from "./bot.service";
import { Context, Markup } from "telegraf";
import { keyboard } from "telegraf/markup";

@Update()
export class Botupdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    ctx.reply("Yangi Yiling Bilan Megajin");
  }

  @On("photo")
  async onPhoto(@Ctx() ctx: Context) {
    if ("photo" in ctx.message!) {
      console.log(ctx.message.photo);
      await ctx.replyWithPhoto(
        ctx.message.photo[ctx.message.photo.length - 1].file_id
      );
    }
  }
  @On("video")
  async onVideo(@Ctx() ctx: Context) {
    if ("video" in ctx.message!) {
      console.log(ctx.message.video);
      await ctx.reply(ctx.message.video.file_name!);
      await ctx.reply(String(ctx.message.video.duration!));
    }
  }

  @On("sticker")
  async onsticker(@Ctx() ctx: Context) {
    if ("sticker" in ctx.message!) {
      console.log(ctx.message.sticker);
      await ctx.reply("👌");
    }
  }

  @On("animation")
  async onanimation(@Ctx() ctx: Context) {
    if ("animation" in ctx.message!) {
      console.log(ctx.message.animation.duration);
      await ctx.reply(ctx.message.animation.mime_type!);
    }
  }

  @On("voice")
  async onvoice(@Ctx() ctx: Context) {
    if ("voice" in ctx.message!) {
      console.log(ctx.message.voice);
      await ctx.reply(ctx.message.voice.file_id!);
    }
  }

  @On("contact")
  async oncontact(@Ctx() ctx: Context) {
    if ("contact" in ctx.message!) {
      console.log(ctx.message.contact);
      await ctx.reply(ctx.message.contact.phone_number);
      await ctx.reply(String(ctx.message.contact.user_id));
    }
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    if ("location" in ctx.message!) {
      console.log(ctx.message.location);
      await ctx.replyWithLocation(
        // ctx.message.location.longitude,
        ctx.message.location.latitude,
        ctx.message.location.longitude
      );
    }
  }

  @Hears("hi")
  async hearsHi(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("<b>Hey There</b>");
  }

  @Command("help")
  async helpCommand(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("<b>Waiting help for infinity. </b>");
  }

  @Hears("6")
  async hearsolti(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("<b>Button 6 activated</b>");
  }

  @Command("inline")
  async inlineKeyboard(@Ctx() ctx: Context) {
    const keyboard = [
      [{ text: "Product 1", callback_data: "product_1" }],
      [{ text: "Product 2", callback_data: "product_2" }],
      [
        { text: "Product 3", callback_data: "product_3" },
        { text: "Product 4", callback_data: "product_4" },
        { text: "Product 5", callback_data: "product_5" },
      ],
    ];

    await ctx.replyWithHTML("<b>Productni tanlang</b>", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  @Command("main")
  async mainKeyboard(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("<b>Main buttonni tanla.</b>", {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["1", "2", "3"],
        ["4", "5"],
        ["6"],
        [Markup.button.contactRequest("📞 Share contact")],
        [Markup.button.contactRequest("🪧 Share location")],
      ])
        .resize()
        .oneTime(),
    });
  }

  @On("text")
  async OnText(@Ctx() ctx: Context) {
    // console.log(ctx)
    if ("text" in ctx.message!) {
      if (ctx.message.text == "hello") {
        await ctx.replyWithHTML("<b>Salom</b>");
      } else {
        await ctx.replyWithHTML(ctx.message.text);
      }
    }
  }

  @On("message")
  async OnMessage(@Ctx() ctx: Context) {
    console.log(ctx.botInfo);
    console.log(ctx.chat);
    console.log(ctx.from);
    console.log(ctx.from?.username);
    console.log(ctx);
  }
}
