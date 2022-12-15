import * as express from "express";
import {
  searchCountry,
  searchWeathers,
} from "../controllers/weather.controller";
const router = express.Router();

router.get("/forecast", searchWeathers);
router.get("/country", searchCountry);

export default router;
