import { searchForecast } from "../services/weather.service";
import { searchCountryDetails } from "../services/country.service";
import { Request, Response, NextFunction } from "express";
import { City, Country } from "../types/weather.type";

export async function searchWeathers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cities, countries } = req.query;
  const weather: City[] = await searchForecast(
    cities.toString(),
    countries.toString()
  );
  res.status(200).json({
    weather,
  });
}

export async function searchCountry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { countryCode } = req.query;
  try {
    const country: Country = await searchCountryDetails(countryCode.toString());
    res.status(200).json({
      status: "success",
      country,
    });
  } catch (err) {
    next(err);
  }
}
