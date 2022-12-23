import { searchForecast } from "../services/weather.service";
import { searchCountryDetails } from "../services/country.service";
import { Request, Response, NextFunction } from "express";

export async function searchWeathers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await searchForecast(req, res, next);
}

export async function searchCountry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await searchCountryDetails(req, res, next);
}
