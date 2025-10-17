import { Action, Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { CarService } from "./cars.service";

@Update()
export class CarUpdate {
  constructor(private readonly carService: CarService) {}

  @Hears("Cars")
  async hearscar(@Ctx() ctx: Context) {
    await this.carService.carMenu(ctx);
  }

  @Hears("Add new car")
  async addNewcar(@Ctx() ctx: Context) {
    await this.carService.addNewCar(ctx);
  }

  @Hears("My cars")
  async showcar(@Ctx() ctx: Context) {
    await this.carService.showCar(ctx);
  }

  @Action(/^delc_+\d+$/)
  async delcar(@Ctx() ctx: Context) {
    await this.carService.delCar(ctx);
  }

}
