import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarCrationAttr {
  user_id: number | undefined;
  last_state: string
}

@Table({ tableName: "car" })
export class Car extends Model<Car, ICarCrationAttr> {
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
    type: DataType.STRING(8),
  })
  declare car_number: string;

  @Column({
    type: DataType.STRING,
  })
  declare color: string;

  @Column({
    type: DataType.STRING(30),
  })
  declare Model: string;

  @Column({
    type: DataType.STRING(30),
  })
  declare Brand: string;

  @Column({
    type: DataType.STRING,
  })
  declare photo: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare last_state: string;
}
