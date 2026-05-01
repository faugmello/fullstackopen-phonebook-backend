const mongoose = require('mongoose')

let operation = ''

if (process.argv.length === 3) {
    operation = 'get'
} else if (process.argv.length === 5) {
    operation = 'add'
} else {
    console.log('usage')
    console.log('get all entries: node file.js password')
    console.log('add entry: node file.js password [person name] [person number]')
    process.exit(1)
}

const url = `mongodb+srv://faugmello_db_user:${process.argv[2]}@fullstackopen-phonebook.8wr576u.mongodb.net/?appName=fullstackopen-phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (operation === 'add') {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        id: Math.random() * 1000000,
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`added ${name} ${number}`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        if (result.length === 0) {
            console.log("phonebook is empty")
        } else {
            console.log("phonebook:")
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
        }
        mongoose.connection.close()
    })
}