const {Schema, model} = require('mongoose')

const schema = new Schema({
        testID: {type: Schema.ObjectId, ref: 'Test'}
    },
    {
        collection: 'questions',
        strict: false
    })

module.exports = model('Question', schema)