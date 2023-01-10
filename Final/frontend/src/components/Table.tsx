import React, { Fragment } from "react";

const Table = ({
  countries,
}: {
  countries: { code: string; cities: string[] }[];
}): JSX.Element => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Countries</th>
            <th>Cities</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(
            (
              country: { code: string; cities: string[] },
              index: number
            ): JSX.Element => (
              <Fragment key={index}>
                <tr>
                  <th>{country.code}</th>
                  {country.cities.map(
                    (city: string, index: number): JSX.Element => (
                      <Fragment key={index}>
                        <td>
                          {city}
                          {/* Adding comma ", " if city is not the last element */}
                          {country.cities.length - index === 1 ? (
                            <span></span>
                          ) : (
                            <span>, </span>
                          )}
                        </td>
                      </Fragment>
                    )
                  )}
                </tr>
              </Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
