import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Address } from './models/address.model';
import { AddressService } from './address/address.service';
import { AddressUpdate } from './address/address.update';
import { CarService } from './car/cars.service';
import { CarUpdate } from './car/cars.update';
import { Car } from './models/car.model';

@Module({
  imports:[SequelizeModule.forFeature([Bot, Address, Car])],
  controllers: [],
  providers: [BotService, AddressService, AddressUpdate, CarService, CarUpdate,BotUpdate],
  exports:[BotService]
})
export class BotModule {}
