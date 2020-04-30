const express = require('express');
const config = require('config')
const mongoose = require('mongoose')

const app = express();

app.use(express.json({ extended: true }))

const PORT = config.get('port') || 5000
const URI = config.get('URI')

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))

async function start() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    }
    catch (e) {
        console.log('Error', e.message)
        process.exit(1)
    }
}

start()