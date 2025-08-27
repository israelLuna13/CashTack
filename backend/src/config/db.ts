import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + "/../models/**/*"],
  //now is working with local database but make a error when the ssl is enabled
  // dialectOptions: {
  //   ssl: {},
  // },
  logging: false,//Do not display query messages in the console
});
 