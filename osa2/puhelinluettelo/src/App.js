import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Phonebook from './components/Phonebook'
import personService from "./services/persons";
import Notification from './components/Notification';
import './index.css'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(data => {
        setPersons(data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const checkName = (element) => element.name.toLowerCase() === newName.toLowerCase()

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(checkName)) {
      //setNewName('')
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {

        let existingPerson = []

        const personObject = {
          name: newName,
          number: newNumber
        }

        personService
          .getAll()
            .then(data => {
             existingPerson = data.filter(checkName)
             personService
              .update(existingPerson[0].id, personObject)
                .then(updatedPerson => {
                  setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
                  setSuccessMessage(
                    `Updated ${newName}`
                  )
                  setTimeout(() => {
                    setSuccessMessage(null)
                  }, 5000)
                })
                .catch(error => {
                  console.log(error)
                  setErrorMessage(
                    `Information of ${newName} has already been removed`
                  )
                  setTimeout(() => {
                    setErrorMessage(null)
                  }, 5000)
                  setPersons(persons.filter(person => person.name !== newName))
                })
            })
            .catch(error => {
              console.log(error)
              setErrorMessage(
                `Information of ${newName} has already been removed`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
              setPersons(persons.filter(person => person.name !== newName))
            })
      }
      else {
        setNewName('')
        setNewNumber('')
      }
    }
    else {

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          alert(`error adding ${personObject.name}`)
        })

    setNewName('')
    setNewNumber('')

    }
}

   const removePerson = (id, name) => {

    if (window.confirm(`Delete ${name}?`)) {
      
      personService
        .remove(id)
          .then(removedPerson => {
            setSuccessMessage(
              `Removed ${name}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            personService
              .getAll()
                .then(data => 
                  {setPersons(data)})
                .catch(error => {console.log(`${error}, error deleting ${name}`)})
          })
          .catch(error => {
            console.log(error)
            setErrorMessage(
              `Information of ${name} has already been removed`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
    }

  }


  const handleNameChange = (event) => (setNewName(event.target.value))
  const handleNumberChange = (event) => (setNewNumber(event.target.value))
  const handleFilterChange = (event) => (setNewFilter(event.target.value))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type={"success"}/>
      <Notification message={errorMessage} type={"error"}/>
      <Filter filter={newFilter} handler={handleFilterChange}/>
      <h3>Add a new contact</h3>
      <PersonForm person={addPerson} nameInput={newName} numberInput={newNumber}
      nameHandler={handleNameChange} numberHandler={handleNumberChange}/>
      <h3>Numbers</h3>
      <Phonebook persons={persons} filter={newFilter} remove={removePerson}/>
    </div>
  )

}

export default App