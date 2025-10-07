import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly mailService: MailService
  ) {}

  async activateUser(link: string): Promise<any> {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }

    const [_, updatedUsers] = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );

    const updatedUser = updatedUsers[0];

    if (!updatedUser) {
      throw new BadRequestException("User already activated");
    }

    return {
      message: "User activated successfully",
      is_active: updatedUser.is_active,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;
    if (password !== confirm_password) {
      throw new BadRequestException({ message: "Parols do not match." });
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      await this.mailService.sendMail(user);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException("Emailga xat yuborishda xatolik");
    }
    return user;
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
