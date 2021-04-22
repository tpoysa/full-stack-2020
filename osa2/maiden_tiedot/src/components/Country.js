import React from 'react'

const Country = (props) => {

    if (props.countrycount === 1) {
        
        return(
            <>
                <h1>{props.name}</h1>
                <p>Capital: {props.capital}</p>
                <p>Population: {props.population}</p>
                <h3>Languages:</h3>
                <ul>
                    {props.languages.map(
                        language => <li key={props.languages.indexOf(language)}>{language.name}</li>
                    )}
                </ul>
                <img src={props.flag} className="flag" alt="flag"/>
            </>
        )

    } else {
        return(
            <li>{props.name}<button onClick={props.handler} value={props.name}>Show</button></li>
        )
    }

}

export default Country