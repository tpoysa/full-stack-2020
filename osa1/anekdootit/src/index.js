import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({text, action}) => {

  return(
  <>
    <button onClick={action}>{text}</button>
  </>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [allVotes, setAll] = useState([])

  const RandomAnecdote = () => {
    
    var previous = selected
    var next = Math.floor(Math.random() * Math.floor(anecdotes.length))

    while (previous === next) {
      next = Math.floor(Math.random() * Math.floor(anecdotes.length))
    }

    setSelected(next)
  }
  
  const Vote = () => {
    setAll(allVotes.concat(selected))
  }

  const calculateVotes = (allVotes, selected) => {
    var sum = 0
    allVotes.forEach(element => {
      if (element === selected) {
        sum = sum + 1
      }
    })
    return sum
  }

  const mostVotes = (allVotes, list) => {
    var max = 0
    var max_index = -1
    var sum = 0

    for (var index = 0; index < list.length; index++) {
      sum = calculateVotes(allVotes, index)
      if (sum > max) {
        max = sum
        max_index = index
      }
    }
    return [max, max_index]
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {calculateVotes(allVotes, selected)} votes</p>
      <Button text='Vote' action={Vote}/>
      <Button text='Next anecdote' action={RandomAnecdote}/>
      <h1>Anecdote with the most votes</h1>
      <p>{props.anecdotes[mostVotes(allVotes, props.anecdotes)[1]]}</p>
      <p>has {mostVotes(allVotes, props.anecdotes)[0]} votes</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)