const mysql = require('mysql')
const dbConf = require('../config/config').mysql_config

const connection = mysql.createConnection(dbConf)

connection.connect(error => {
    
    if(error) throw error

    console.log("Mysql connected")
})

module.exports = connection