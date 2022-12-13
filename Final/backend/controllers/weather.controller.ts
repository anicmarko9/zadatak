import { search } from "../services/weather.service";
import * as express from "express";

export async function searchResults(
  req: express.Request,
  res: express.Response
) {
  const { cities, countries } = req.params;
  const citiesArray = cities.split(", ");
  const result = await search(citiesArray, countries);
  res.send(result);
}
