import React from 'react'
import Person from './Person'

const Phonebook = ({persons, filter, remove}) => {
    
    const namesToShow = filter === '' ?
    persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <ul>
            {namesToShow.map(person => <Person key={person.name} person={person} remove={remove}/>)}
        </ul>
    )
}

export default Phonebook