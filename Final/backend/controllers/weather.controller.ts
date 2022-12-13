import { search } from "../services/weather.service";
import * as express from "express";
import { City } from "../types/weather.type";

export async function searchResults(
  req: express.Request,
  res: express.Response
) {
  const { cities, countries } = req.params;
  const result: City[] = await search(cities, countries);
  res.send(result);
}
