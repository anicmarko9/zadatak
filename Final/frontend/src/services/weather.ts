import { getDate, gradientColor } from "../features/helper";
import { DAYS } from "../mocks/mock";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Weather, City } from "../types/weatherTypes";
import catchError from "./catchError";

export const getWeathers = async (
  cities: string,
  countries: string
): Promise<Weather[]> => {
  const weathersArray: Weather[] = [];
  const citiesArray: City[] = await fetchData({ cities, countries });
  if (citiesArray) {
    citiesArray.forEach((city: City) => {
      weathersArray.push(checkCity(city, countries));
    });
    weathersArray.sort(compare);
  }
  return weathersArray;
};

const fetchData = async (data: {
  cities: string;
  countries: string;
}): Promise<City[]> => {
  try {
    const response: AxiosResponse = await axios.get(
      `http://localhost:5000/weathers/forecast?cities=${data.cities}&countries=${data.countries}`,
      { withCredentials: true }
    );
    return response.data.weather;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const checkCity = (city: City, country: string): Weather => {
  if (!(city.temps.length > 0)) {
    let msg: string = `City: [${city.name}] isn't available, or it is not in this country: [${country}].`;
    return {
      error: msg,
      gradientColors: ["#39f", "#f93"],
      // avg temp = 90 just so it will be sorted as last element later on...
      dblAvgTemp: 900,
      country,
    };
  } else {
    let temperatures: { temp: number[]; avgTemp: number; dblAvgTemp: number } =
      calculateTemperatures(city);
    let dayInWeek: { day: number[]; dayName: string[] } = getDay(city);
    return {
      name: city.name,
      temp: temperatures.temp,
      avgTemp: temperatures.avgTemp,
      dblAvgTemp: temperatures.dblAvgTemp,
      day: dayInWeek.day,
      dayName: dayInWeek.dayName,
      date: getNextFiveDays(city),
      gradientColors: getGradientColors(temperatures.temp),
      img: getNextFiveImages(city.img),
      country,
      error: null,
    };
  }
};

// ascending from lowest to highest
const compare = (a: Weather, b: Weather): number => {
  return a.dblAvgTemp - b.dblAvgTemp;
};

const calculateTemperatures = (
  city: City
): { temp: number[]; avgTemp: number; dblAvgTemp: number } => {
  // temp is avg temp in one day.  It is array of 5 numbers.
  // from 06:00 PM [first day] to 03:00 PM [second day]
  let temp: number[] = [];
  // avg temp is average temp in the next 5 days.
  let avgTemp: number = 0;
  let dblAvgTemp: number;
  let br: number = 0;
  for (let i: number = 0; i < city.temps.length / 8; i++) {
    // Every day
    let s: number = 0;
    for (let j: number = 0; j < city.temps.length / 5; j++) {
      // Every 3 hours
      s += city.temps[br++];
    }
    temp[i] = Math.round(s / 8);
    avgTemp += temp[i];
  }
  dblAvgTemp = avgTemp / temp.length;
  avgTemp = Math.round(avgTemp / temp.length);
  return { temp, avgTemp, dblAvgTemp };
};

const getDay = (city: City): { day: number[]; dayName: string[] } => {
  let day: number[] = [];
  let dayName: string[] = [];
  for (let i: number = 0; i < city.days.length / 8; i++) {
    // 5 loops for 5 days
    day[i] = new Date().getDay() + i;
    // if day goes from Saturday to Sunday (US Format)
    if (day[i] > 6) {
      day[i] = day[i] - 7;
    }
    dayName[i] = DAYS[day[i]];
  }
  return { day, dayName };
};

const getNextFiveDays = (city: City): string => {
  let firstDay: number[] = city.days[0]
    .slice(0, 10)
    .split("-")
    .map((txt) => parseInt(txt));
  let lastDay: number[] = city.days[32]
    .slice(0, 10)
    .split("-")
    .map((txt) => parseInt(txt));
  let date: string = getDate(firstDay, lastDay);
  return date;
};

const getGradientColors = (temp: number[]): string[] => {
  let gradientColors: string[] = [];
  temp.forEach((temp) => {
    gradientColors.push(gradientColor(temp));
  });
  return gradientColors;
};

const getNextFiveImages = (img: string[]): string[] => {
  const fiveImg: string[] = [];
  for (let i: number = 0; i < img.length; i += 8)
    fiveImg.push(`https://openweathermap.org/img/wn/${img[i]}d@2x.png`);
  return fiveImg;
};
