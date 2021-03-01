import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const StatisticLine = ({counter, text, text2}) => {
  return (
    <tr>
      <td>{text} {counter} {text2}</td>
    </tr>
  )
}

const Button = ({text, action}) => {
  return(
  <>
    <button onClick={action}>{text}</button>
  </>
  )
}

const Statistics = (props) => {

  const average = (allVotes) => {
    var sum = 0
    allVotes.forEach(element => {
      sum = sum + element
    })

    return sum / allVotes.length
  }

  const percentage = (allVotes, good) => {
    return (good / allVotes.length)*100
  }

  if(props.allVotes.length === 0) {
  return(
    <div>
      No feedback given
    </div>
  )
  }

  return(
  <>
    <table>
      <tbody>
        <StatisticLine counter={props.good} text='Good'/>
        <StatisticLine counter={props.neutral} text='Neutral'/>
        <StatisticLine counter={props.bad} text='Bad'/>
        <StatisticLine counter={props.all} text='All'/>
        <StatisticLine counter={average(props.allVotes)} text='Average'/>
        <StatisticLine counter={percentage(props.allVotes, props.good)} text='Positive' text2='%'/>
      </tbody>
    </table>
  </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allVotes, setAll] = useState([])

  const IncreaseGoodByOne = () => {
    setGood(good + 1)
    setAll(allVotes.concat(1))
  }
  const IncreaseNeutralByOne = () => {
    setNeutral(neutral + 1)
    setAll(allVotes.concat(0))
  }
  const IncreaseBadByOne = () => {
    setBad(bad + 1)
    setAll(allVotes.concat(-1))
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text='Good' action={IncreaseGoodByOne}/>
      <Button text='Neutral' action={IncreaseNeutralByOne}/>
      <Button text='Bad' action={IncreaseBadByOne}/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={good+neutral+bad}
      allVotes = {allVotes}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)