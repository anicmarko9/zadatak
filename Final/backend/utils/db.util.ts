import { QueryInterface, Sequelize } from "sequelize";
import { Umzug, SequelizeStorage, MigrationMeta } from "umzug";

export const sequelize: Sequelize = new Sequelize(
  "users",
  "postgres",
  "qwerty123",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

const migrationConf = {
  migrations: {
    glob: "models/migrations/*.ts",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("database connected");
  } catch (err) {
    console.log("connecting database failed");
    console.error(err);
    return process.exit(1);
  }

  return null;
};
