import { Column, DataType, Model, Table } from "sequelize-typescript"

interface IUserCreationAttr{
    name:string
    phone:string
    email:string
    password:string
    tg_link:string
    location:string
    // regionId:number
    // districtId:number
}

@Table({ tableName: "user" })
export class User extends Model<User, IUserCreationAttr> {
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
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(50),
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
    type: DataType.STRING(100),
  })
  declare location: string;

  @Column({
    type: DataType.STRING(2000),
  })
  declare refresh_token: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare activation_link: string;

//   regionId: number;
//   districtId: number;
}
