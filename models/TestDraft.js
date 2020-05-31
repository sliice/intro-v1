const {Schema, model} = require('mongoose')

const schema = new Schema({
        name: {type: String}
    },
    {
        collection: 'testdrafts',
        strict: false
    })

module.exports = model('TestDraft', schema)