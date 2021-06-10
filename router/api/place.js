const express = require('express')
const router = express.Router()
const sql = require('../../model/db')
const api_key = require('../../config/apiKey').google_map_api

router.get('/place', (req, res) => {
    
    sql.query("SELECT * FROM place", (err, data) => {
        if(err) throw err

        if(data) res.send(data)
    })
})

router.get('/place/:key/:value', (req, res) => {
    
    sql.query(`SELECT * FROM place WHERE ${req.params.key} = ${req.params.value}`, (err, data) => {
        if (err) {
            console.log(err)
        }

        if(data === '') {
            res.json(data[0])
        } else {
            res.json({'message': 'Data tidak ditemukan'})
            console.log(api_key)
        }
    })
})

module.exports = router