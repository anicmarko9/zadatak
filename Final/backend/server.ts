import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught Exception!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app";
import { Server } from "http";
import { getHostAddress } from "./utils/network.util";

let port: number = parseInt(process.env.PORT) || 5000;
let host: string = process.env.HOST || getHostAddress();

const server: Server = app
  .listen(port, host)
  .on("error", function (e: { code: string }): void {
    if (e.code !== "EADDRINUSE" && e.code !== "EACCES") {
      throw e;
    }
    console.log("Port " + port + " is busy. Trying the next available port...");
    app.listen(++port);
  })
  .on("listening", function (): void {
    console.log(
      "API is successfully started. Listening on http://" + host + ":" + port
    );
  });

process.on("unhandledRejection", (err: Error) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
