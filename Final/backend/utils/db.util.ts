import { Sequelize } from "sequelize";

export const sequelize: Sequelize = new Sequelize(
  process.env.DATABASE_LOCAL,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
  } catch (err) {
    console.log("Failed to connect to the database.");
    return process.exit(1);
  }

  return null;
};
