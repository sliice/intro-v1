const {Schema, model} = require('mongoose')

const schema = new Schema({
        userID: {type: Schema.ObjectId, ref: 'User'},
        scaleResultID: {type: Schema.ObjectId, ref: 'ScaleResult'},
        points: {type: Number},
        date: {type: Date, default: Date.now(), required: true}
    },
    {
        collection: 'userscaleresults',
        strict: false
    })

module.exports = model('UserScaleResult', schema)