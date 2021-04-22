import React from 'react'
import Country from './Country'

const ListCountries = ({countries, filter, handler}) => {

    const countriesToShow = filter === '' || countries.filter(country => 
        country.name.toLowerCase().includes(filter.toLowerCase())).length > 10 ?
        [] : countries.filter(country => 
        country.name.toLowerCase().includes(filter.toLowerCase()))



    if (countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase())).length > 10) {

    return(
        <>Too many matches, specify another filter</>
    )
    }
    else if (countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase())).length === 1) {
        return (
            <div>
            {countriesToShow.map(country => <Country key={country.numericCode} name={country.name}
                capital={country.capital} population={country.population} languages={country.languages}
                flag={country.flag} countrycount={countriesToShow.length}/>)}
            </div>
        )
    }
    else {
        return(
        <ul>
        {countriesToShow.map(country => <Country key={country.numericCode} name={country.name}
         capital={country.capital} population={country.population} languages={country.languages}
         flag={country.flag} countrycount={countriesToShow.length} handler={handler}/>)}
        </ul>)
    }
}

export default ListCountries