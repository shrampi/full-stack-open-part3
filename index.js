
require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');

const Person = require('./models/person');

app.use(express.json());

morgan.token('person', (request, response) => {return JSON.stringify(request.body)});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.static('build'))    

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        result.forEach(person => console.log(person));
        response.json(result);
    })
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(result => {
        console.log('retrieving ', result);
        response.json(result);
    })
});

app.get('/api/info', (request, response) => {
    response.contentType('text/html');
    response.write(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>
    `);
    response.end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
})

const generateID = () => {
    return Math.floor(Math.random() * 999999999999);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body);
    if (!body.name || !body.number) {
        return response.status(404).json({ error: 'name or number missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});