import { useState } from "react";
import { filterString, handleInput } from "../features/helper";
import { getWeathers } from "../services/weather";
import { COUNTRIES } from "../mocks/mock";
import Results from "./Results";
import React from "react";
import { Weather } from "../types/weatherTypes";
import Table from "./Table";
import { InputData } from "../types/userTypes";

const SearchBar = (): JSX.Element => {
  const [weathers, setWeathers] = useState<Weather[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    e.preventDefault();
    const input: InputData = handleInput("Weather");

    const weathersArray: Weather[] = await getWeathers(
      input.cities,
      input.country
    );

    setWeathers(weathersArray);
    setLoading(false);
  };

  return (
    <div className="home-container">
      <Table countries={COUNTRIES} />
      <form className="inputForm" onSubmit={handleSubmit}>
        <select name="countries" id="countries">
          {COUNTRIES.map(
            (
              country: { code: string; cities: string[] },
              index: number
            ): JSX.Element => (
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
