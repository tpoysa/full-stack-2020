import React from 'react'

const Total = ({parts}) => {

    const reducer = (sum, val) =>  sum + val

    return (
      <>
        <p><b>Total of {parts.map(part => part.exercises).reduce(reducer,0)} exercises</b></p>
      </>
      )
  }

export default Total