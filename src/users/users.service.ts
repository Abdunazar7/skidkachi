import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";
import { PhoneUserDto } from "./dto/phone-user.dto";
import otpGenetator from "otp-generator";
import { BotService } from "../bot/bot.service";
import { SmsService } from "../sms/sms.service";
import { decode, encode } from "../common/helpers/crypto";
import { AddMinutesToDate } from "../common/helpers/addMinutes";
import { Otp } from "./models/otp.model";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;
    if (password !== confirm_password) {
      throw new BadRequestException({ message: "Parollar mos emas" });
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    // createUserDto.password = hashedPassword
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      await this.mailService.sendMail(user);
    } catch (error) {
      throw new ServiceUnavailableException("Emailga hat yuboshirda xatolik");
    }
    return user;
  }

  async findAll() {
    return this.userModel.findAll();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user;
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async activateUser(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }
    const updateUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );
    if (!updateUser[1][0]) {
      throw new BadRequestException("User already activetes");
    }
    return {
      message: "User activated successFully",
      is_active: updateUser[1][0].is_active,
    };
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone_number;
    const otp = otpGenetator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const isSend = await this.botService.sendOtp(phone_number, otp);
    if (!isSend) {
      throw new BadRequestException("Avval botda royxatdan oting");
    }

    // const response = await this.smsService.sendSMS(phone_number, otp);

    const messageSMS =
      "OTP code has been send to ****" +
      phone_number.slice(phone_number.length - 4);

    // END-SMS

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpData = await this.otpModel.create({
      otp,
      phone_number,
      expiration_time,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpData.id,
    };

    const encodedData = await encode(JSON.stringify(details));

    return {
      message: "Botga otp yuborildi",
      verification_key: encodedData,
      messageSMS,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone: phone_number, otp } = verifyOtpDto;

    // 1️⃣ Keyni decode qilish
    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);

    // 2️⃣ Telefon raqamini solishtirish
    if (details.phone_number !== phone_number) {
      throw new BadRequestException("OTP bu telefon raqamga yuborilmagan");
    }

    // 3️⃣ OTP ma’lumotini olish
    const resultOTP = await this.otpModel.findByPk(details.otp_id);
    if (!resultOTP) {
      throw new BadRequestException("Bunday OTP topilmadi");
    }

    // 4️⃣ Tekshirilgan yoki muddati tugaganligini aniqlash
    if (resultOTP.verified) {
      throw new BadRequestException("Bu OTP avval tekshirilgan");
    }

    const currentDate = new Date();
    if (resultOTP.expiration_time < currentDate) {
      throw new BadRequestException("Bu OTPning vaqti tugagan");
    }

    // 5️⃣ OTP kodni solishtirish
    if (resultOTP.otp !== otp) {
      throw new BadRequestException("OTP mos emas");
    }

    // 6️⃣ OTP muvaffaqiyatli tekshirildi
    await this.otpModel.update(
      { verified: true },
      { where: { id: resultOTP.id } }
    );

    // 7️⃣ Foydalanuvchini faollashtirish (agar kerak bo‘lsa)
    const user = await this.userModel.update(
      { is_active: true },
      { where: { phone: phone_number }, returning: true }
    );

    return {
      message: "OTP muvaffaqiyatli tasdiqlandi",
      user: user[1][0],
    };
  }
}
