const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const mongoose = require("mongoose")
require('./database/connection')

const errorMiddleware = require('./middleware/error')
app.use(errorMiddleware)

app.use(express.json()) // it parses json data to give to req
app.use(cookieParser())
// route imports
const blog = require('./routes/blogRoute')
const user = require('./routes/userRoute')
app.use('/api/v1', blog)
app.use('/api/v1', user)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`)
})