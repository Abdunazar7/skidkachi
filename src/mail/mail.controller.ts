import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { User } from '../users/models/user.model';


@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("send")
  async send(@Body() user: User) {
    return this.mailService.sendMail(user);
  }

  @Post()
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto);
  }

  @Get()
  findAll() {
    return this.mailService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.mailService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMailDto: UpdateMailDto) {
    return this.mailService.update(+id, updateMailDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.mailService.remove(+id);
  }
}
