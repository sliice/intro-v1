const {Schema, model} = require('mongoose')

const schema = new Schema({
    userID: {type: Schema.ObjectId, ref: 'User'},
    testID: {type: Schema.ObjectId, ref: 'Test'},
    answers: [String]
}, {
    collection: 'useranswers',
    strict: false
})

module.exports = model('UserAnswers', schema)