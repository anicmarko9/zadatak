import { City, Country } from "../types/weather.type";
import axios from "axios";
import { fetchCity } from "./weather.service";
import { COUNTRIES } from "../../frontend/src/mocks/mock";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

//API_REST=https://restcountries.com/v3.1/alpha/

export const searchCountryDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { countryCode } = req.query;

  if (countryCode.length !== 2)
    return next(
      new AppError("Code length should be equal to 2 characters!", 400)
    );
  if (!COUNTRIES.some((el) => el.code === countryCode))
    return next(new AppError("Country is unavailable!", 400));

  console.log("-------------------------------------------------------------");
  console.time("\nFetched all data synchronously in");
  let start: number = new Date().getTime();

  const country: Country = await fetchCountry(countryCode.toString());

  console.log(
    `Fetched ${country.name} in: ${new Date().getTime() - start}ms` // kraj [ms]
  );
  const city: City = await fetchCity(
    country.capitalCity,
    countryCode.toString().toUpperCase()
  );
  country.forecast = city;
  console.timeEnd("\nFetched all data synchronously in");

  res.status(200).json({
    status: "success",
    country,
  });
};

const fetchCountry = async (countryCode: string) => {
  try {
    const res = await axios.get(`${process.env.API_REST}${countryCode}`);
    var country: Country = {
      name: res.data[0].name.common,
      officialName: res.data[0].name.official,
      independent: res.data[0].independent,
      currency: res.data[0].currencies,
      capitalCity: res.data[0].capital[0].replace(/,+/g, ""),
      continent: res.data[0].region,
      subContinent: res.data[0].subregion,
      languages: Object.values(res.data[0].languages),
      landlocked: res.data[0].landlocked,
      area: res.data[0].area.toLocaleString(),
      population: res.data[0].population.toLocaleString(),
      drivingSide: res.data[0].car.side,
      flagUrl: res.data[0].flags.png,
      error: null,
    };
    return country;
  } catch (err) {
    console.log(err);
  }
};
