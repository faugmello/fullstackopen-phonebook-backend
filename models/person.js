require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log("connecting to MongoDB")
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Person name is required']
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                if (v.length < 8) return false;
                if (v.includes('-')) {
                  const parts = v.split('-');
                  if (parts.length !== 2) return false;
                  const [prefix, suffix] = parts;
                  const prefixIsValid = /^\d{2,3}$/.test(prefix);
                  const suffixIsValid = /^\d+$/.test(suffix);
                  return prefixIsValid && suffixIsValid;
                }
                return /^\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid number format`
        },
        required: [true, 'Person phone number is required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
