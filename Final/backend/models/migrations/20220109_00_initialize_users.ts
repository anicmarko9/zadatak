import { DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter your name",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: {
        name: "email",
        msg: "This email already exists!",
      },
      validate: {
        isEmail: {
          msg: "Wrong email format!",
        },
        notNull: {
          msg: "Please enter your email",
        },
        isLowercase: {
          msg: "Email must be lowercase!",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue:
        "https://res.cloudinary.com/dfptc3ila/image/upload/v1672134561/default_hmbqah.jpg",
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          msg: "Password length must be at least 8 characters long!",
          args: [8, 100],
        },
        notNull: {
          msg: "Please enter your password",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          msg: "Password length must be at least 8 characters long!",
          args: [8, 100],
        },
        notNull: {
          msg: "Please confirm your password",
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.BIGINT,
    },
  });
}
export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("users");
}
