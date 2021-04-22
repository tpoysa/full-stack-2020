import React from 'react'
import Part from './Part'

const Content = ({parts}) => {
    
    return (
    <div>
        {parts.map(element => <Part key={element.name} part={element}/>)}
    </div>

      )
  }

export default Content