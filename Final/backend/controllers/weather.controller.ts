import { search } from "../services/weather.service";
import * as express from "express";

export async function searchResults(
  req: express.Request,
  res: express.Response
) {
  const result = await search(req.body.cities, req.body.countries);
  res.send(result);
}
