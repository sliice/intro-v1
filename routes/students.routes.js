const {Router} = require('express')
const User = require('../models/User')
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const auth = require('../middleware/auth.middleware')


// /api/students/create
router.post('/create',
    [
        check('login', 'Too short. Min length is 2').isLength({ min: 2 }),
        check('password', 'Incorrect password. Min length is 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect registration data'})
            }

            const {login, password, type, name, surname, grade, letter } = req.body

            const candidate = await User.findOne({ login })
            if (candidate)
                res.status(400).json({ message: "This user already  exists"})
            const hashedPassword = await bcrypt.hash(password, 12)

            const user = new User({ login, password: hashedPassword, type, name, surname})

            await user.save()
            res.status(201).json({ message: "User've created"})

            // if user is a student
            if (type === 'u') {
                try {
                    const candidateStudent = await User.findOne({ login })
                    const student = new Student({ user: candidateStudent._id, grade , letter})
                    await student.save()
                    res.status(201).json({ message: "Student've created"})
                }
                catch (e) {
                    res.status(500).json({ message: "Something went wrong with creating a student. Try again" })
                }
            }

        }
        catch(e){
            res.status(500).json({ message: "Something went wrong with creating a user. Try again" })
        }
    })

// /api/students
    router.get('/', auth, async (req, res) => {
        try {
            const students = await Student.find()

            for (var i = 0; i < students.length; i++) {
                students[i] = JSON.parse(JSON.stringify(students[i]))
                const student = await User.findById(students[i].user)
                students[i].name = JSON.parse(JSON.stringify(student)).name
                students[i].surname = JSON.parse(JSON.stringify(student)).surname
            }
            res.json(students)
        }
        catch(e){
            res.status(500).json({ message: "Something went wrong. Try again" })
        }
    })

module.exports = router