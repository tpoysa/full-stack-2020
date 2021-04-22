import './App.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ListCountries from './components/ListCountries'
import Filter from './components/Filter'

function App() {

  const [data, setData] = useState([])
  const [ newFilter, setNewFilter ] = useState('')
  const handleFilterChange = (event) => (setNewFilter(event.target.value))


  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }

  useEffect(hook, [])


  return (
    <div className="App">
        <Filter filter={newFilter} handler={handleFilterChange}/>
        <ListCountries countries={data} filter={newFilter} handler={handleFilterChange}/>
    </div>
  );
}

export default App;
