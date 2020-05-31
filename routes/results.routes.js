const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const Scale = require('../models/Scale')
const Test = require('../models/Test')
const ScaleResult = require('../models/ScaleResult')
const UserScaleResult = require('../models/UserScaleResult')
const auth = require('../middleware/auth.middleware')


// /login
router.get('/:login', auth, async (req, res) => {

    // A long result:

    // try {
    //     const user = await User.findOne({ login: req.params.login })
    //     const userResults = await UserScaleResult.find({ userID: user._id })
    //
    //     // Total results (server response s)
    //     const results = []
    //     for (let i = 0; i < userResults.length; i++){
    //         const scaleResult = await ScaleResult.findOne({ _id: userResults[i].scaleResultID })
    //         const scale = await Scale.findOne({ _id: scaleResult.scaleID})
    //         const test = await Test.findOne({ _id: scale.testID })
    //         const total = {points: userResults[i].points, scaleResult: scaleResult.name, description: scaleResult.description, date: userResults[i].date, important: scaleResult.important}
    //
    //         results.push({ testID: test._id, link: test.link, test: test.name, result: total })
    //     }
    //     res.json(results)
    // }
    // catch(e){
    //     res.status(500).json({ message: "Something went wrong. Try again" })
    // }

    // A short version of result is:

    try {
        const user = await User.findOne({ login: req.params.login })
        const userResults = await UserScaleResult.find({ userID: user._id })

        // Total results (server response s)
        const results = []
        const tests = []
        for (let i = 0; i < userResults.length; i++) {
            const scaleResult = await ScaleResult.findOne({_id: userResults[i].scaleResultID})
            if (scaleResult.important) {
                // total.push({scaleResult: scaleResult.name, date: userResults[i].date})
                let scale = await Scale.findOne({_id: scaleResult.scaleID})
                let test = await Test.findOne({_id: scale.testID})
                if (!tests.includes(test._id.toString())) tests.push(test._id.toString())
            }
        }

        for (let i = 0; i < tests.length; i++){
            let total = []
            let test = await Test.findOne({ _id: tests[i] })
            for (let j = 0; j < userResults.length; j++) {
                let scaleResult = await ScaleResult.findOne({ _id: userResults[j].scaleResultID })
                if (scaleResult.important){
                    const scale = await Scale.findOne({ _id: scaleResult.scaleID})
                    if (test._id.toString() === scale.testID.toString()) total.push({ scaleResult: scaleResult.name, date: userResults[j].date })
                }
            }
            results.push({ testID: test._id, link: test.link, test: test.name, result: total })
        }
        res.json(results)
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})



module.exports = router