const {Schema, model} = require('mongoose')

const schema = new Schema({
    userID: {type: Schema.ObjectId, ref: 'User', required: true},
    scaleID: {type: Schema.ObjectId, ref: 'Scale', required: true},
    points: {type: Number, required: true},
    date: {type: Date, default: Date.now(), required: true}
}, {
    collection: 'userscalepoints',
    strict: false
})

module.exports = model('UserScalePoins', schema)