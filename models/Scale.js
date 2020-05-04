const {Schema, model} = require('mongoose')

const schema = new Schema({
        testID: {type: Schema.ObjectId, ref: 'Test'},
        name: {type: String},
        k: {type: Number}
    },
    {
        collection: 'scales',
        strict: false
    })

module.exports = model('Scale', schema)