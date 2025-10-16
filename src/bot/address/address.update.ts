import { Action, Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { AddressService } from "./address.service";

@Update()
export class AddressUpdate {
  constructor(private readonly addressService: AddressService) {}

  @Hears("Manzillar")
  async hearsAddress(@Ctx() ctx: Context) {
    await this.addressService.addressMenu(ctx);
  }

  @Hears("Mening manzillarim")
  async showAddress(@Ctx() ctx: Context) {
    await this.addressService.showAddress(ctx);
  }

  @Hears("Yangi manzil qoshish")
  async addNewAddress(@Ctx() ctx: Context) {
    await this.addressService.addNewAddress(ctx);
  }

  @Action(/^loc_+\d+$/)
  async showLocation(@Ctx() ctx: Context) {
    await this.addressService.showLocation(ctx);
  }

  @Action(/^del_+\d+$/)
  async delLocation(@Ctx() ctx: Context) {
    await this.addressService.delLocation(ctx);
  }
}
