import { useState } from "react";
import { filterString } from "../features/helper";
import { checkCity, compare, fetchData } from "../services/service";
import { CITIES, COUNTRIES } from "../mocks/mock";
import Results from "./Results";
import React from "react";
import { Weather, City } from "./../types/type";

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

    const citiesArray: City[] = await fetchData({ cities, countries });

    citiesArray.forEach((city: City) => {
      weathersArray.push(checkCity(city, countries));
    });

    weathersArray.sort(compare);
    setWeathers(weathersArray);
    setLoading(false);
  };

  return (
    <div className="home-container">
      <h3>
        Available countries:
        <span className="purple"> {COUNTRIES.join(", ")}</span>
      </h3>
      <h3>
        Available cities:<span className="purple"> {CITIES.join(", ")}</span>
      </h3>
      <form className="inputForm" onSubmit={handleSubmit}>
        <select name="countries" id="countries">
          {COUNTRIES.map((country: string, index: number) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
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
        ) : !weathers ? (
          <p></p>
        ) : (
          <Results weathers={weathers} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
