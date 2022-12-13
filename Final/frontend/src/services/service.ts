import { getDate, gradientColor } from "../features/helper";
import { CITIES, COUNTRIES, DAYS } from "../mocks/mock";
import axios from "axios";
import { Weather, City } from "./../types/type";

export const fetchData = async (data: {
  cities: string;
  countries: string;
}): Promise<City[]> => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/weathers/${data.cities}/${data.countries}`
    );
    return response.data.weather;
  } catch (error) {
    console.error("Server is offline!", error);
  }
};

export const checkCity = (city: City, country: string): Weather => {
  if (
    !CITIES.includes(city.name) ||
    !COUNTRIES.includes(country) ||
    city.temps.length < 20
  ) {
    let msg = `City: [${city.name}] isn't available, or it is not in this country: [${country}].`;
    console.log(msg);
    return {
      error: msg,
      gradientColors: ["#6cf", "#fc6"],
      // avg temp = 90 just so it will be sorted as last element later on...
      dblAvgTemp: 90,
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
      error: null,
    };
  }
};

export const compare = (a: Weather, b: Weather): number => {
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
    // loops 5 times
    let s: number = 0;
    for (let j: number = 0; j < city.temps.length / 5; j++) {
      //loops 8 times
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
