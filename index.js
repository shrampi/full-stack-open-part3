
const express = require('express');
const app = express();
const morgan = require('morgan');

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.use(express.json())

morgan.token('person', (request, response) => {return JSON.stringify(request.body)});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    console.log(person);
    if (person) {
        response.json(person);
        return response.end();
    }

    response.status(404).end();
    
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
    const {name, number } = request.body;
    
    if (!name || !number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    if (persons.map(p => p.name).indexOf(name) !== -1) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        name: name,
        number: number,
        id: generateID()
    }

    persons = persons.concat(person);

    response.json(person);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});