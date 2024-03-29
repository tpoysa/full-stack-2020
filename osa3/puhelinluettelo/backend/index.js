require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {

  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/info', (req, res, next) => {

  Person.countDocuments({}).then(persons => {
    let date = new Date()
    res.send(
      `<div>Phonebook has info for ${persons} people</div>
      <div>${date}</div>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id).then(person => {
    if(person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end()
  })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {

  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {

  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if(error.name === 'ValidationError') {
    return response.status(400).send(error)
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})