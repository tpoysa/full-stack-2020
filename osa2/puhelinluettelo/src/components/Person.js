import React from 'react'

const Person = ({person, remove}) => {
    return (
        <li>{person.name} {person.number} <button onClick={() => remove(person.id, person.name)}>delete</button></li>
      )
}

export default Person