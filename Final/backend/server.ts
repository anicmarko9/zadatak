import * as express from "express";
const app = express();
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { getHostAddress } from "./utils/network.util";
dotenv.config({ path: "./.env" });
import weatherRouter from "./routes/weather.route";
import * as cors from "cors";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

app.use("/weathers/", weatherRouter);

app.use(
  (
    err: { statusCode: number; message: string; stack: string },
    req: express.Request,
    res: express.Response,
    next: any
  ) => {
    const statusCode: number = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  }
);

app.use((req: express.Request, res: express.Response, next: any) => {
  res.send({ error: "Page not found!" });
});

let port: number = parseInt(process.env.PORT) || 5000;
let host: string = process.env.HOST || getHostAddress();

app
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
