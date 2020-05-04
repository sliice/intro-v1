// import mongoose from 'mongoose'
const {Router} = require('express')
const Test = require('../models/Test')
const Question = require('../models/Question')
const UserAnswers = require('../models/UserAnswers')
const Scale = require('../models/Scale')
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
        const candidate = await UserAnswers.find({ userID: req.body.userID, testID: req.body.testID })

        if (candidate)
            res.status(400).json({ message: "This result already  exists"})


        // MAKE SURE TO UNCOMMENT IT!!!!

        // const userAnswers = new UserAnswers(req.body)
        // await userAnswers.save()

        //  CONTINUE AN ANSWERS PROCESSING!

        const scalesJSON = await Scale.find()
        console.log("THE SCALES ARE: ", scales)

        const answersJSON = req.body
        // const answersArr =
        console.log(answers)

        res.status(201).json({ message: "Answers've saved"})
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router