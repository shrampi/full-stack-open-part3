
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to ', url);
mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('failed to connect to MongoDB: ', error.message))

const validateNumber = (phoneNumber) => {
    const hyphen = phoneNumber.indexOf('-');
    if (hyphen === -1 || hyphen > 2){
        return true;
    }
    return false;
}

const personSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 3, 
        required: true
    },
    number: {
        type: String,
        minLength: 8, 
        required: true,
        validate: {
            validator: validateNumber,
            message: () => 'phone number is invalid'
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;

