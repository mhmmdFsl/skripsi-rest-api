const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from('<h1> Selamat Datang di Api Saya'))
})

module.exports = router