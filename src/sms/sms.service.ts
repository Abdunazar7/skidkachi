import { Injectable } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";

@Injectable()
export class SmsService {
  async sendSMS(phone_number: string, otp: string) {
    const data = new FormData();
    data.append("mobile_phone", phone_number);
    data.append("message", `Bu Eskiz dan test`);//opt
    data.append("from", "4546");

    console.log("SMS service URL:", process.env.SMS_URL);

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url: process.env.SMS_URL,
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
        ...data.getHeaders(),
      },
      data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("SMS yuborishda xatolik:", error.response?.data || error);
      return { status: 500, message: "SMS yuborilmadi" };
    }
  }
}
