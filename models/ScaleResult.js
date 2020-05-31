const {Schema, model} = require('mongoose')

const schema = new Schema({
        scaleID: {type: Schema.ObjectId, ref: 'Scale'},
        min: {type: Number},
        max: {type: Number},
        name: {type: String},
        description: {type: String},
        important: {type: Boolean, default: false}
    },
    {
        collection: 'scaleresults',
        strict: false
    })

module.exports = model('ScaleResult', schema)