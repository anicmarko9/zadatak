import * as express from "express";
import { searchResults } from "../controllers/weather.controller";
const router = express.Router();

router.get("/:cities/:countries", searchResults);

export default router;
