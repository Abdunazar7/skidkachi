import { Action, Command, Ctx, Hears, On, Start, TelegrafException, Update } from "nestjs-telegraf";
import { BotService } from "./bot.service";
import { Context, Markup } from "telegraf";
import { UseFilters, UseGuards } from "@nestjs/common";
import { TelegrafExceptionFilter } from "../common/filters/telegraf-exception.filter";
import { AdminGuard } from "../common/guards/admin.guard";
import { ChannelSubscriptionGuard } from "../common/guards/subscribe.guard";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @UseFilters(TelegrafExceptionFilter)
  @UseGuards(AdminGuard)
  @Command("admin")
  async onAdminCommand(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx, `Xush kelibsiz, ADMIN 🙋‍♂️`);
  }

  @UseGuards(ChannelSubscriptionGuard)
  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @UseGuards(ChannelSubscriptionGuard)
  @Action("subscribed")
  async subscribe(@Ctx() ctx: Context) {
    const contextMessage = ctx.callbackQuery!["message"];
    await ctx.deleteMessage(contextMessage?.message_id);
    this.start(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command("stop")
  async onstop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }

  @Hears("Asosiy menyuga qaytish")
  async mainMenu(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  @On("photo")
  async onPhoto(@Ctx() ctx: Context) {
    await this.botService.onPhoto(ctx);
  }

  // @On("video")
  // async onVideo(@Ctx() ctx: Context) {
  //   if ("video" in ctx.message!) {
  //     console.log(ctx.message.video);
  //     await ctx.reply(ctx.message.video.file_name!);
  //   }
  // }

  // @On("sticker")
  // async onSticer(@Ctx() ctx: Context) {
  //   if ("sticer" in ctx.message!) {
  //     console.log(ctx.message.sticer);
  //     // await ctx.replyWithSticker(ctx.message.sticer!);
  //     await ctx.reply("😂");
  //   }
  // }

  // @On("animation")
  // async onAnimation(@Ctx() ctx: Context) {
  //   if ("animation" in ctx.message!) {
  //     console.log(ctx.message.animation);
  //     // await ctx.replyWithSticker(ctx.message.animation!);
  //     await ctx.reply(ctx.message.animation.file_name!);
  //   }
  // }

  // @On("voice")
  // async onVoise(@Ctx() ctx: Context) {
  //   if ("voice" in ctx.message!) {
  //     console.log(ctx.message.voice);
  //     await ctx.replyWithVoice(ctx.message.voice.file_id);
  //     await ctx.reply(ctx.message.voice.mime_type!);
  //   }
  // }

  // @On("contact")
  // async onContact(@Ctx() ctx: Context) {
  //   if ("contact" in ctx.message!) {
  //     console.log(ctx.message.contact);
  //     await ctx.reply(ctx.message.contact.phone_number);
  //     await ctx.reply(String(ctx.message.contact.user_id));
  //     await ctx.reply(String(ctx.message.contact.first_name));
  //   }
  // }

  // @Hears("hi")
  // async hearsHi(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>Hi there</b>");
  // }

  // @Command("help")
  // async helpCommand(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>Biz ishlamayapmiz</b>");
  // }

  // @Hears("olti")
  // async hearsOlti(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>6 there</b>");
  // }

  // @Action("product_1")
  // async prod_1(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>1 bosildi</b>");
  // }

  // @Action(/^product_\d/)
  // async anyProductSelect(@Ctx() ctx: Context) {
  //   if("data" in ctx.callbackQuery!){
  //     const data = ctx.callbackQuery?.data
  //     const productId = data.split("_")[1]
  //     await ctx.replyWithHTML(`<b>${productId} bosildi</b>`);
  //   }
  // }

  // @Command("main")
  // async mainKeyboard(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>Main button ni tanla</b>", {
  //     parse_mode: "HTML",
  //     ...Markup.keyboard([
  //       ["bir", "ikki", "uch"],
  //       ["Tort", "besh"],
  //       ["olti"],
  //       [Markup.button.contactRequest(" telefon reqamingni yubor")],
  //       [Markup.button.locationRequest(" Turgan manzilingni yubor")],
  //     ])
  //       .resize()
  //       .oneTime(),
  //   });
  // }

  // @Command("inline")
  // async inlineKeyboard(@Ctx() ctx: Context) {
  //   const Keyboards = [
  //     [
  //       {
  //         text: "Product 1",
  //         callback_data: "product_1",
  //       },
  //       {
  //         text: "Product 2",
  //         callback_data: "product_2",
  //       },
  //       {
  //         text: "Product 3",
  //         callback_data: "product_3",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Product 4",
  //         callback_data: "product_4",
  //       },
  //       {
  //         text: "Product 5",
  //         callback_data: "product_5",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Product 6",
  //         callback_data: "product_6",
  //       },
  //     ],
  //   ];
  //   await ctx.replyWithHTML("<b>Productni tanlang</b>", {
  //     parse_mode: "HTML",
  //     reply_markup: {
  //       inline_keyboard: Keyboards,
  //     },
  //   });
  // }

  // //
  // ///

  // @On("text")
  // async onText(@Ctx() ctx: Context) {
  //   console.log(ctx);
  //   if ("text" in ctx.message!) {
  //     if (ctx.message.text == "hello") {
  //       await ctx.replyWithHTML("<b>Salom 2</b>");
  //     } else {
  //       await ctx.replyWithHTML(ctx.message.text);
  //     }
  //   }
  // }

  // @On("message")
  // async onmessage(@Ctx() ctx: Context) {
  //   console.log(ctx.botInfo);
  //   console.log(ctx.chat);
  //   console.log(ctx.chat?.type);
  //   console.log(ctx.from);
  //   console.log(ctx.from?.username);
  // }
}
