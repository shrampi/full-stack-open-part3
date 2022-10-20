
require('dotenv').config()
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const morgan = require('morgan');

const Person = require('./models/person');

app.use(express.json());

morgan.token('person', (request, response) => { return JSON.stringify(request.body) });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result);
    })
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.get('/api/info', (request, response) => {

    Person.find({}).then(result => {
        response.contentType('text/html');
        response.write(
            `
            <p>Phonebook has info for ${result.length} people.</p>
            <p>${new Date()}</p>
            `
        );
        response.end();
    })

    
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body);
    if (!body.name || !body.number) {
        return response.status(404).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;
    
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' });
    }

    next(error);
}

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});