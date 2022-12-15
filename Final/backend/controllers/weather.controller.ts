import { searchForecast } from "../services/weather.service";
import { searchCountryDetails } from "../services/country.service";
import * as express from "express";
import { City, Country } from "../types/weather.type";

export async function searchWeathers(
  req: express.Request,
  res: express.Response
) {
  const { cities, countries } = req.query;
  const result: City[] = await searchForecast(
    cities.toString(),
    countries.toString().toUpperCase()
  );
  res.send(result);
}

export async function searchCountry(
  req: express.Request,
  res: express.Response
) {
  const { countryCode } = req.query;
  const country: Country = await searchCountryDetails(countryCode.toString());
  res.send(country);
}
