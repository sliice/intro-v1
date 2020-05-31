const {Router} = require('express')
const router = Router()

const auth = require('../middleware/auth.middleware')
const TestDraft =  require('../models/TestDraft')

// addtest/drafts
router.get('/drafts', auth, async(req, res) => {
    try {
        const drafts = await TestDraft.find()
        res.json(drafts)
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// addtest/savedraft
router.post('/savedraft', async(req, res) => {
    try {
        const data = req.body
        if (data.name === '') data.name = 'Без названия'
        if (data._id) {
            const draft = await TestDraft.findByIdAndUpdate(data._id, {...data})
        }
        else {
            const newDraft = new TestDraft(data)
            await newDraft.save()
        }
        res.status(201).json({ message: "Draft is saved" })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router