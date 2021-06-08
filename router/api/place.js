const express = require('express')
const router = express.Router()
const sql = require('../../model/db')

router.get('/place', (req, res) => {
    
    sql.query("SELECT * FROM place", (err, data) => {
        if(err) throw err

        if(data) res.send(data)
    })
})

module.exports = router