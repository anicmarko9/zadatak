import * as express from "express";
const app: express.Express = express();
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import weatherRouter from "./routes/weather.route";
import userRouter from "./routes/user.route";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import helmet from "helmet";
import * as mongoSanitize from "express-mongo-sanitize";
import AppError from "./utils/AppError";
import * as cors from "cors";

process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught Exception!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Set security HTTP headers
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(mongoSanitize());

// app.use(function (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Limit requests from same API
const limiter: RateLimitRequestHandler = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/", limiter);

app.use("/weathers", weatherRouter);
app.use("/users", userRouter);

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
    const err: AppError = new AppError(
      `Route ${req.originalUrl} is unavailable!`,
      404
    );
    res.status(404).json({
      status: err["status"],
      message: err["message"],
    });
  }
);

export default app;
