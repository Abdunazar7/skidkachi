import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { Bot } from "../models/bot.model";
import { BOT_NAME } from "../../app.constants";
import { Address } from "../models/address.model";

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async addressMenu(ctx: Context, menuText = "Manzillar menusi") {
    try {
      await ctx.replyWithHTML(menuText, {
        ...Markup.keyboard([
          ["Mening manzillarim", "Yangi manzil qoshish"],
          ["Asosiy menyuga qaytish"],
        ]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addNewAddress(ctx: Context, menuText = "Manzillar menusi") {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML("/start", {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      }

      await this.addressModel.create({ user_id, last_state: "name" });

      await ctx.replyWithHTML("Yangi manzil nomini kriting", {
        ...Markup.removeKeyboard(),
      });
    } catch (error) {
      console.log("addnewAddress error", error);
    }
  }

  async showAddress(ctx: Context, menuText = "Manzillar menusi") {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML("/start", {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      }

      const address = await this.addressModel.findAll({
        where: { user_id, last_state: "finish" },
      });
      if (address.length == 0) {
        await ctx.replyWithHTML("Sizda manzil qoshilmagan");
      } else {
        address.forEach(async (address) => {
          await ctx.replyWithHTML(
            `<b>Manzil nomi:</b> ${address.name}\n <b>Manzil:</b> ${address.address}\n`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Lokatsiyani ko'rish",
                      callback_data: `loc_${address.id}`,
                    },
                    {
                      text: "Lokatsiyani o'chrish",
                      callback_data: `del_${address.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("showAddress error", error);
    }
  }

  async showLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const contextMessage = ctx.callbackQuery!["message"];
      const address_id = contextAction.split("_")[1];
      const addres = await this.addressModel.findOne({ where: { id: address_id } });

      await ctx.deleteMessage(contextMessage?.message_id)
      
      await ctx.replyWithLocation(
        Number(addres?.location.split(",")[0]),
        Number(addres?.location.split(",")[1])
      );

      // await ctx.replyWithHTML("Manzil ochrildi");
    } catch (error) {
      console.log("Error on show Location", error);
    }
  }

  async delLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"]
      const address_id = contextAction.split("_")[1]
      await this.addressModel.destroy({where:{id:address_id}})
      
      await ctx.editMessageText("Manzil ochrildi")


    } catch (error) {
      console.log("Error on del", error);
    }
  }

  
}
