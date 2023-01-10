import { Router } from "express";
import {
  searchCountry,
  searchWeathers,
} from "../controllers/weather.controller";
import * as authController from "./../controllers/auth.controller";
const router: Router = Router();

router.get("/forecast", authController.loggedIn, searchWeathers);
router.get("/country", authController.loggedIn, searchCountry);

export default router;
