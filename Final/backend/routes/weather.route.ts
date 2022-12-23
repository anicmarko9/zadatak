import { Router } from "express";
import {
  searchCountry,
  searchWeathers,
} from "../controllers/weather.controller";
const router: Router = Router();

router.get("/forecast", searchWeathers);
router.get("/country", searchCountry);

export default router;
