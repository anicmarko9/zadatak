import * as express from "express";
import { searchResults } from "../controllers/weather.controller";
const router = express.Router();

router.post("/", searchResults);

export default router;
