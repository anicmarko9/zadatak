import { City } from "./../types/weather.type";
import axios from "axios";

const APIKEY: string = process.env.OPEN_WEATHER_KEY;
const API: string = process.env.API;

export const search = async (
  cities: string[],
  country: string
): Promise<any> => {
  let all: Promise<void>[] = [];
  let weather: City[] = [];

  console.log();
  console.time("\nFetched all cities concurrently in");
  // fetch data for one or more cities and store them into an array: "all"
  cities.forEach((city: string) => {
    all.push(resolvePromise(city, country, weather));
  });
  await Promise.all(all);
  console.timeEnd("\nFetched all cities concurrently in");
  return {
    weather,
  };
};

const resolvePromise = async (
  cityName: string,
  country: string,
  weather: City[]
): Promise<void> => {
  let start: number = new Date().getTime(); // pocetak [ms]
  const city: City = await fetchCity(cityName, country);
  weather.push(city);
  console.log(
    `Fetched ${cityName} in: ${new Date().getTime() - start}ms` // kraj [ms]
  );
};

const fetchCity = async (cityName: string, country: string): Promise<City> => {
  try {
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
    const city: City = {
      name,
      temps,
      days,
    };
    return city;
  } catch (err) {
    console.log(
      `City: [${cityName}] isn't available, or it is not in this country: [${country}].\n`
    );
    const city: City = {
      name: cityName,
      temps: [],
      days: [],
    };
    return city;
  }
};
