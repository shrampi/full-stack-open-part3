
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2];
const url = `mongodb+srv://shrampi:${password}@cluster0.odqtjoj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personScheme = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personScheme);


mongoose.connect(url)
    .then(result => {
        console.log('connected');

        if (process.argv.length === 3) {
            Person.find({}).then(result => {
                result.forEach(person => console.log(person));
                mongoose.connection.close();
            })
        }

        else {
            const name = process.argv[3];
            const number = process.argv[4];

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
