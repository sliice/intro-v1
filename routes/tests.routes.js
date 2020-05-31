// import mongoose from 'mongoose'
const {Router} = require('express')
const Test = require('../models/Test')
const Question = require('../models/Question')
const UserAnswers = require('../models/UserAnswers')
const Scale = require('../models/Scale')
const UserScalePoints = require('../models/UserScalePoints')
const ScaleResult = require('../models/ScaleResult')
const router = Router()
const auth = require('../middleware/auth.middleware')

// /api/tests
router.get('/', auth, async (req, res) => {
    try {
        const tests = await Test.find()
        res.json(tests)
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /api/tests/id
router.get('/:id', auth, async (req, res) => {
    try {
        const tests = await Test.findOne({ link: req.params.id })
        const questions = await Question.findOne({ testID: tests._id })
        res.json({tests, questions})
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /id/save
router.post('/:id/save', auth, async (req, res) => {
    try {
        const candidate = await UserAnswers.findOneAndDelete({ userID: req.body.userID, testID: req.body.testID })

        // Saving user's answers
        const userAnswers = new UserAnswers(req.body)
        await userAnswers.save()

        // Find all the scales related to the test
        // Two-answered test only yet
        const scalesJSON = await Scale.find({ testID: req.body.testID })
        const answersJSON = req.body
        const yes = []
        const no = []
        for (let key in answersJSON) {
            if (key.includes('a')) {
                if (answersJSON[key]) yes.push(key.slice(1))
                else if (!answersJSON[key]) no.push(key.slice(1))
            }
        }

        const scalePointsJSON = []
        const scaleUserResult = []

        scalesJSON.map( async (scale, index) => {
            let matches = 0
            try {
                scale.get('yes').forEach( element => {
                    if (yes.indexOf(element) > -1) matches += 1 * scale.k
                })
            }
            catch (e) {}
            try {
                scale.get('no').forEach( element => {
                    if (no.indexOf(element) > -1) matches += 1 * scale.k
                })
            }
            catch (e) {}

            scalePointsJSON[index] = { userID: req.body.userID, scaleID: scale._id, points: matches,  }

            // await UserScalePoints.findOneAndDelete({ userID: req.body.userID, scaleID: scale._id })
            // const userScalePoints = new UserScalePoints(scalePointsJSON[index])
            // await userScalePoints.save()

                // if (!await UserScalePoints.findOneAndUpdate({ userID: req.body.userID, scaleID: scale._id }, scalePointsJSON[index])) {
            const userScalePoints = await UserScalePoints.updateOne({ userID: req.body.userID, scaleID: scale._id }, scalePointsJSON[index])
                if (!userScalePoints) {
                    console.log("NO RESULT FOUND")
                    console.log("  ")
                    console.log("  ")
                    console.log("  ")
                    const userScalePoints = new UserScalePoints(scalePointsJSON[index])
                    await userScalePoints.save()
                }
                // else console.log("POINTS'VE BEEN FOUND    !!!!!!!!!!!!!!!!")

            // scaleUserResult[index] = await ScaleResult.findOne({ scaleID: scale._id, min: { $lte: matches}, max: { $gte: matches }})
        })


        // console.log("SCALE USER RESULT IS AN ARRAY:", scaleUserResult)
        // res.status(201).json(scaleUserResult)
        // res.json(scaleUserResult)
        res.status(201).json({ message: "Result is saved"})
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router