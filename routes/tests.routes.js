// import mongoose from 'mongoose'
const {Router} = require('express')
const Test = require('../models/Test')
const Question = require('../models/Question')
const UserAnswers = require('../models/UserAnswers')
const Scale = require('../models/Scale')
const UserScalePoints = require('../models/UserScalePoints')
const router = Router()
const auth = require('../middleware/auth.middleware')

// /api/tests
router.get('/', auth, async (req, res) => {
    try {
        const tests = await Test.find()
        if (tests) console.log(tests)
        else console.log("No test")
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

            scalePointsJSON[index] = { userID: req.body.userID, scaleID: scale._id, points: matches }

            await UserScalePoints.findOneAndDelete({ userID: req.body.userID, scaleID: scale._id })
            const userScalePoints = new UserScalePoints(scalePointsJSON[index])
            await userScalePoints.save()
        })

        res.status(201).json({ message: "Result is saved"})
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router