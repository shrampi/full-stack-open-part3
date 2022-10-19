
require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);


mongoose.connect(url)
    .then(result => {
        console.log('connected');

        if (process.argv.length === 2) {
            console.log('here')
            Person.find({}).then(result => {
                result.forEach(person => console.log(person));
                mongoose.connection.close();
            })
        }

        else {
            const name = process.argv[2];
            const number = process.argv[3];

            const person = new Person({
                name: name,
                number: number
            })

            person.save().then(result => {
                console.log(`added ${name} number ${number} to the phonebook`);
                mongoose.connection.close();
            })
        }

    })
