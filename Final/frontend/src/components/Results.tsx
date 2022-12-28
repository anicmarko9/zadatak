import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Weather } from "../types/weatherTypes";

const Results = ({ weathers }): JSX.Element => {
  const colorChange = (gradientEndpoints: string): void => {
    document.body.style.background = `linear-gradient(to right bottom, ${gradientEndpoints}) no-repeat fixed`;
  };

  return (
    <div className="results-container">
      {weathers.map(
        (city: Weather, index: number): JSX.Element => (
          <fieldset
            className="card"
            key={index}
            onClick={() => colorChange(city.gradientColors.join(", "))}
          >
            <>
              {colorChange(weathers[0].gradientColors.join(", "))}
              {!city.error ? (
                <Fragment key={index}>
                  <Link to={`/weathers/${city.country}`}>
                    <p className="town" id={city.gradientColors.join(", ")}>
                      {city.name}
                    </p>
                  </Link>
                  <p>{city.date}</p>
                  <p className="temp avg">
                    {city.avgTemp}
                    <sup>&#8451;</sup>
                  </p>
                  <div className="days">
                    {city.dayName.map(
                      (day: string, index: number): JSX.Element => (
                        <Fragment key={index}>
                          <div className="day">
                            <p>{day}</p>
                            <img src={city.img[index]} alt="Icon" />
                            <p className="temp">
                              {city.temp[index]}
                              <sup>&#8451;</sup>
                            </p>
                          </div>
                        </Fragment>
                      )
                    )}
                  </div>
                </Fragment>
              ) : (
                <p className="error">{city.error}</p>
              )}
            </>
          </fieldset>
        )
      )}
    </div>
  );
};

export default Results;
