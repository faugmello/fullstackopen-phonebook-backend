require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('requestBody', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        console.log(result)
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id)
        .then(result => res.json(result))
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({})
        .then(result => {
            const page = "<p>Phonebook has info for " +
                result.length +
                " people</p><p>" +
                new Date() +
                "</p>"
            res.send(page)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(result => res.json({ id: id }))
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => {
            console.log(error)
            next(error)
        })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(`${error.name}: ${error.message}`)

    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})