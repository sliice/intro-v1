const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const User = require('../models/User')

// /api/auth/register
router.post('/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password. Min length is 6').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        console.log('BODY: !!!!!!!!!!!!!!!!!!!!!!',req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect registration data'})
        }

        const {email, password} = req.body

        const candidate = await User.findOne({ email })
        if (candidate)
            res.status(400).json({ message: "This user already  exists"})
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword})

        await user.save()
        res.status(201).json({ message: "User've created"})
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /api/auth/login
router.post('/login',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect authorization data'})
        }

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user)
            res.status(400).json({ message: 'Wrong email' })

        const isMatching = await bcrypt.compare(password, user.password)
        if (!isMatching)
            res.status(400).json({ message: 'Wrong password' })

        const token = jwt.sign(
            { userID: user.id },
            config.get('jwtKEY'),
            { expiresIn: '1h' }
        )

        res.json({ token, userID: user.id })
    }
    catch(e){
        res.status(500).json({ message: 'Something went wrong. Try again' })
    }
})

module.exports = router