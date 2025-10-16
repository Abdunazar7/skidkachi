import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME, UZB_CAR_REGEX } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { Op } from "sequelize";
import { AddressService } from "./address/address.service";
import { Car } from "./models/car.model";
import { CarService } from "./car/cars.service";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Car) private readonly carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    private readonly addresService: AddressService,
    private readonly carService: CarService
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id,
          username: ctx.from!.username,
          first_name: ctx.from!.first_name,
          last_name: ctx.from!.last_name,
          language_code: ctx.from!.language_code,
        });
        await ctx.replyWithHTML(
          `iltimos,<b> telefon raqamingizni kriting</b> tugmani bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else if (!user.is_active) {
        await ctx.replyWithHTML(
          `iltimos,<b> telefon raqamingizni kriting</b> tugmani bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else {
        await this.mainMenu(
          ctx,
          "Bu bot orqali skidkachi tizimida faoliyat olib boradigan Magazin egalari uchun"
        );

        // await ctx.replyWithHTML(
        //   `Bu bot orqali \skidkachi tizimida faoliyat olib boradigan Magazin egalari uchun`,
        //   {
        //     ...Markup.keyboard([["Sozlama", "Manzillar"]]).resize(), // keyinchalik ovner buttonlari chqariladi
        //   }
        // );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([[`/start`]])
              .oneTime()
              .resize(),
          });
        } else if (ctx.message.contact.user_id != user_id) {
          await ctx.replyWithHTML(
            "O'zingizni telefoni raqaminginzni jonating",
            {
              ...Markup.keyboard([
                [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
              ])
                .oneTime()
                .resize(),
            }
          );
        } else {
          const phone = ctx.message.contact.phone_number;
          user.is_active = true;
          user.phone_number = phone[0] == "+" ? phone : "+" + phone;
          await user.save();
          await this.mainMenu(ctx, "tabriklaymiz siz ovner boldingiz");
          // await ctx.replyWithHTML("tabriklaymiz royxatdan otdingiz", {
          //   ...Markup.keyboard([["Sozlama", "Manzillar"]]),
          // });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          //--------------ADDRESS--------------------

          const address = await this.addressModel.findOne({
            where: { user_id, last_state: { [Op.ne]: "finish" } },
            order: [["id", "DESC"]],
          });
          if (address) {
            switch (address.last_state) {
              case "name":
                address.name = ctx.message.text;
                address.last_state = "address";
                await address.save();
                await ctx.replyWithHTML(
                  "Manzilni kriting(masalan, Muqumiy 15)"
                );
                break;
              case "address":
                address.address = ctx.message.text;
                address.last_state = "location";
                await address.save();
                await ctx.replyWithHTML("Manzilni lokatsiyasini yuboring", {
                  ...Markup.keyboard([
                    [Markup.button.locationRequest("Lokatsiyani yuboring")],
                  ]).resize(),
                });
                break;
            }
          }
          //--------------Car--------------------

          const car = await this.carModel.findOne({
            where: { user_id, last_state: { [Op.ne]: "finish" } },
            order: [["id", "DESC"]],
          });
          if (car) {
            switch (car.last_state) {
              case "car_number":
                const number = ctx.message.text;
                if (UZB_CAR_REGEX.test(number)) {
                  car.car_number = number;
                  car.last_state = "color";
                  car.save();
                  await ctx.replyWithHTML("Mashina rangini kriting");
                } else{
                  await ctx.replyWithHTML("notog'ri famotda kritdingiz \n qaytadan kritin");
                }
                break;

              case "color":
                const color = ctx.message.text;
                car.color = color;
                car.last_state = "Model";
                car.save();
                await ctx.replyWithHTML("Mashina modelini kriting");
                break;

              case "Model":
                const model = ctx.message.text;
                car.Model = model;
                car.last_state = "Brand";
                car.save();
                await ctx.replyWithHTML("Mashina brendini  kriting");
                break;

              case "Brand":
                const brand = ctx.message.text;
                car.Brand = brand;
                car.last_state = "photo";
                car.save();
                await ctx.replyWithHTML("Mashina resmini kritin  kriting");
                break;
              default:
                break;
            }
          }
          //--------------Shop--------------------
        }
      }
    } catch (error) {
      console.log("Error on text", error);
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          //--------------ADDRESS--------------------

          const address = await this.addressModel.findOne({
            where: { user_id, last_state: "location" },
            order: [["id", "DESC"]],
          });
          if (address) {
            address.location = `${ctx.message.location.latitude},${ctx.message.location.longitude} `;
            address.last_state = "finish";
            await address.save();
            await this.addresService.addressMenu(ctx, "Yangi manzil qoshildi");
          }
          //--------------Car--------------------
          //--------------Shop--------------------
        }
      }
    } catch (error) {
      console.log("Error on text", error);
    }
  }

  async onPhoto(ctx: Context) {
    try {
      if ("photo" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          //--------------Car--------------------

          const car = await this.carModel.findOne({
            where: { user_id, last_state: "photo" },
            order: [["id", "DESC"]],
          });
          if (car) {
            const GROUP_ID = process.env.CHAT_ID;
            const photo = ctx.message.photo.pop()
            const fileId = photo?.file_id
            const sent = await ctx.telegram.sendPhoto(GROUP_ID!, fileId!,{caption:`User: ${user_id}`})
            const storedFileId = sent.photo.pop()?.file_id

            car.photo = storedFileId!
            car.last_state = "finish" 
            await car.save()
            await this.carService.carMenu(ctx, "Yangi mashina qoshildi")
          }
          //--------------Shop--------------------
        }
      }
    } catch (error) {
      console.log("Error on text", error);
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      await this.bot.telegram.sendMessage(user_id, "xayr");

      if (user) {
        user.is_active = false;
        await user.save();
        await ctx.replyWithHTML(
          "siz botda foaliyatingizni tixtadingiz /start ni bosing",
          {
            ...Markup.keyboard([[`/start`]])
              .oneTime()
              .resize(),
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendOtp(phone_number: string, otp: string) {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      if (!user || !user.is_active) {
        return false;
      }

      await this.bot.telegram.sendMessage(user.user_id, `verify code: ` + otp);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async mainMenu(ctx: Context, menuText = "Asosiy menusi") {
    try {
      await ctx.replyWithHTML(menuText, {
        ...Markup.keyboard([["Sozlama", "Manzillar", "Mashinalar"]]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
