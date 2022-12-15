export type City = {
  name: string;
  temps: number[];
  days: string[];
  img: string[];
};

export type Country = {
  name?: string;
  officialName?: string;
  independent?: boolean;
  currency?: { code: { name: string; symbol: string } };
  capitalCity?: string;
  continent?: string;
  subContinent?: string;
  languages?: string[];
  landlocked?: boolean;
  area?: number;
  population?: number;
  drivingSide?: string;
  flagUrl?: string;
  mapUrl?: string;
  forecast?: City;
  error: string;
};
