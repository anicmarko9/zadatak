export type Weather = {
  name?: string;
  temp?: number[];
  avgTemp?: number;
  dblAvgTemp: number;
  day?: number[];
  dayName?: string[];
  date?: string;
  gradientColors: string[];
  img?: string[];
  country: string;
  error: string;
};
export type City = {
  name: string;
  temps: number[];
  days: string[];
  img: string[];
};
