import React from 'react'

const Filter = ({filter, handler}) => {
    return(
    <div>Find countries: <input value={filter} onChange={handler}/></div>
    )
}

export default Filter