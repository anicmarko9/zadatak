import { City } from "./../types/weather.type";
import axios from "axios";
import { COUNTRIES } from "./../../frontend/src/mocks/mock";

const APIKEY: string = process.env.OPEN_WEATHER_KEY;
const API: string = process.env.API;

export const searchForecast = async (
  cities: string,
  country: string
): Promise<City[]> => {
  //remove duplicates in an array
  const citiesArray: string[] = cities.split(", ");
  const uniqueCities: string[] = [...new Set(citiesArray)];

  let all: Promise<void>[] = [];
  let weather: City[] = [];

  console.log();
  if (uniqueCities.length > 1)
    console.time("\nFetched all cities concurrently in");

  uniqueCities.forEach((city: string) => {
    all.push(resolvePromise(city, country, weather));
  });
  await Promise.all(all);

  if (uniqueCities.length > 1)
    console.timeEnd("\nFetched all cities concurrently in");
  return weather;
};

const resolvePromise = async (
  cityName: string,
  country: string,
  weather: City[]
): Promise<void> => {
  let start: number = new Date().getTime(); // pocetak [ms]
  const city: City = await fetchCity(cityName, country);
  weather.push(city);
  if (city.temps.length > 0)
    console.log(
      `Fetched ${cityName} in: ${new Date().getTime() - start}ms` // kraj [ms]
    );
};

const fetchCity = async (cityName: string, country: string): Promise<City> => {
  try {
    if (
      !COUNTRIES.some(
        (el) => el.cities.includes(cityName) && el.code === country
      )
    )
      throw "unavailable";
    const res = await axios.get(
      `${API}data/2.5/forecast?q=${cityName},${country}&units=metric&appid=${APIKEY}`
    );
    const name: string = res.data.city.name;
    const temps: number[] = res.data.list.map(
      (el: { main: { feels_like: number } }) => el.main.feels_like
    );
    const days: string[] = res.data.list.map(
      (el: { dt_txt: string }) => el.dt_txt
    );
    const img: string[] = res.data.list.map(
      (el: { weather: { icon: string }[] }) => el.weather[0].icon.slice(0, 2)
    );
    var city: City = {
      name,
      temps,
      days,
      img,
    };
  } catch (err) {
    console.log(
      `City: [${cityName}] is ${err}, or it is not in this country: [${country}].`
    );
    var city: City = {
      name: cityName,
      temps: [],
      days: [],
      img: [],
    };
  } finally {
    return city;
  }
};
