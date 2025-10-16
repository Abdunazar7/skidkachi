import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
  tg_link: string;
  @IsOptional()
  @IsString()
  location: string;
  //   regionId: number;
  //   districtId: number;
}
