import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { Bot } from "../models/bot.model";
import { BOT_NAME } from "../../app.constants";
import { Car } from "../models/car.model";

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Car) private readonly CarModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async carMenu(ctx: Context, menuText = "Mashinalar menusi") {
    try {
      await ctx.replyWithHTML(menuText, {
        ...Markup.keyboard([
          ["Mening mashinalarim", "Yangi mashina qoshish"],
          ["Asosiy menyuga qaytish"],
        ]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addNewCar(ctx: Context, menuText = "Mashinalar menusi") {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML("/start", {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      }

      await this.CarModel.create({ user_id, last_state: "car_number" });

      await ctx.replyWithHTML("Yangi mashina raqamini kritin", {
        ...Markup.removeKeyboard(),
      });
    } catch (error) {
      console.log("addnewCar error", error);
    }
  }

  async showCar(ctx: Context, menuText = "Mashinalar menusi") {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML("/start", {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      }

      const car = await this.CarModel.findAll({
        where: { user_id, last_state: "finish" },
      });
      if (car.length == 0) {
        await ctx.replyWithHTML("Sizda mashina qoshilmagan");
      } else {
        car.forEach(async (car) => {
          await ctx.replyWithPhoto(car.photo, {
            caption: `Manzil brand: ${car.Brand}\n 
            model: ${car.Model}\n 
            raqam: ${car.car_number}\n 
            rangi: ${car.color}\n`,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "rasimni ochrish", callback_data: `delc_${car.id}` },
                ],
              ],
            },
          });
        });
      }
    } catch (error) {
      console.log("showAddress error", error);
    }
  }

  async delCar(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];
      await this.CarModel.destroy({ where: { id: car_id } });

      await ctx.replyWithHTML("Mashina malumot ochrildi");
    } catch (error) {
      console.log("Error on delCar", error);
    }
  }
}
