import { Injectable } from "@nestjs/common";
import { CreateMailDto } from "./dto/create-mail.dto";
import { UpdateMailDto } from "./dto/update-mail.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../users/models/user.model";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_HOST}/api/users/activate/${user.activation_link}`;
    console.log(url);

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Skidkachi API. ",
      template: "./confirmation",
      context: {
        name: user.name,
        url,
      },
    });
  }

  create(createMailDto: CreateMailDto) {
    return "This action adds a new mail";
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
