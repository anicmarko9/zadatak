import { useState } from "react";
import { filterString } from "../features/helper";
import { checkCity, compare, fetchData } from "../services/service";
import { COUNTRIES } from "../mocks/mock";
import Results from "./Results";
import React from "react";
import { Weather, City } from "./../types/type";
import Table from "./Table";

const SearchBar = (): JSX.Element => {
  const [weathers, setWeathers] = useState<Weather[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    // Definisanje ulaza
    const weathersArray: Weather[] = [];
    const hardInputString: string = (
      document.getElementById("cities") as HTMLInputElement
    ).value;
    const cities: string = filterString(hardInputString);
    const countries: string = (
      document.getElementById("countries") as HTMLInputElement
    ).value;
    // Definisanje ulaza

    const citiesArray: City[] = await fetchData({ cities, countries });

    if (citiesArray) {
      citiesArray.forEach((city: City) => {
        weathersArray.push(checkCity(city, countries));
      });
      weathersArray.sort(compare);
    }

    setWeathers(weathersArray);
    setLoading(false);
  };

  return (
    <div className="home-container">
      <Table countries={COUNTRIES} />
      <form className="inputForm" onSubmit={handleSubmit}>
        <select name="countries" id="countries">
          {COUNTRIES.map(
            (country: { code: string; cities: string[] }, index: number) => (
              <option key={index} value={country.code}>
                {country.code}
              </option>
            )
          )}
        </select>
        <input
          id="cities"
          type="search"
          name="cities"
          placeholder="Belgrade, Novi Sad, Niš"
          required={true}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results-container">
        {loading ? (
          <p className="card" id="loading">
            Loading...
          </p>
        ) : (
          <Results weathers={weathers} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
