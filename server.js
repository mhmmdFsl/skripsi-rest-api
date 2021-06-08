const express = require('express')
const path = require('path')
const homeRouter = require('./router/home')
const apiUserRouter = require('./router/api/users')
const apiMapRouter = require('./router/api/place')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))

app.use('/', homeRouter)
app.use('/api', apiUserRouter)
app.use('/api/map', apiMapRouter)

const port = 5000

app.listen(port, () => console.log(`Server running on port ${port}`))