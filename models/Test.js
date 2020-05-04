const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    link: {type: String},
    questions: {type: Number},
    description: {type: String},
    shortDescription: {type: String},
    date: {type: Date, default: Date.now}
},
    {collection: 'tests'})

module.exports = model('Test', schema)