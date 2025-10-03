import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";



interface IUserCreationAttr{
    name: string;
    phone: string;
    email: string;
    password: string;
    tg_link: string;
    location: string;
    // regionId: number;
    // districtId: number;
}

@Table({ tableName: "user" })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({
    example: "1",
    description: "User id",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(15),
    unique: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare tg_link: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare location: string;

  @ApiProperty({
    example: "1234567",
    description: "Foydalanuvchi paroli",
  })
  @Column({
    type: DataType.STRING(100),
  })
  declare password: string;


  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_owner: boolean;

  @Column({
    type: DataType.STRING(2000),
  })
  declare refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  declare activation_link: string;
}
