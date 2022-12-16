import * as express from "express";
const app = express();
import * as bodyParser from "body-parser";
import weatherRouter from "./routes/weather.route";
import * as cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught Exception!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/weathers", limiter, weatherRouter);

app.use(
  (
    err: { statusCode: number; message: string; stack: string },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode: number = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  }
);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send({ error: "Page not found!" });
  }
);

export default app;
