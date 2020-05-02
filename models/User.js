const {Schema, model} = require('mongoose')

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type: {type: String},
    name: {type: String},
    surname: {type: String}
})

module.exports = model('User', schema)