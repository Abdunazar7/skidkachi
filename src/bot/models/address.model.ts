import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

interface IAddressCrationAttr {
  user_id: number | undefined;
  last_state: string
}

@Table({ tableName: "address" })
export class Address extends Model<Address, IAddressCrationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING(50),
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare address: string;

  @Column({
    type: DataType.STRING(30),
  })
  declare location: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare last_state: string;
}
