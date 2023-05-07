const mongoose = require('mongoose')
const DATABASE = process.env.DATABASE

mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connection successfull')
}).catch((err) => {
    console.log('connection failed!')
    console.log(err)
})