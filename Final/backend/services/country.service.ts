import { City, Country } from "../types/weather.type";
import axios from "axios";
import { searchForecast } from "./weather.service";
import { COUNTRIES } from "../../frontend/src/mocks/mock";

//API_REST=https://restcountries.com/v3.1/alpha/

export const searchCountryDetails = async (
  countryCode: string
): Promise<Country> => {
  console.time("\nFetched all data synchronously in");
  let start: number = new Date().getTime();
  const country: Country = await fetchCountry(countryCode);
  if (!country.error) {
    console.log(
      `\nFetched ${country.name} in: ${new Date().getTime() - start}ms` // kraj [ms]
    );
    const city: City[] = await searchForecast(
      country.capitalCity,
      countryCode.toUpperCase()
    );
    country.forecast = city[0];
  } else {
    console.log(country.error);
  }
  console.timeEnd("\nFetched all data synchronously in");
  console.log("-------------------------------------------------------------");
  return country;
};

const fetchCountry = async (countryCode: string) => {
  try {
    if (
      countryCode.length !== 2 ||
      !COUNTRIES.some((el) => el.code === countryCode)
    )
      throw "Code length should be equal to 2 characters, or country is unavailabe!";
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
  } catch (err) {
    var country: Country = {
      error: err,
    };
  } finally {
    return country;
  }
};
