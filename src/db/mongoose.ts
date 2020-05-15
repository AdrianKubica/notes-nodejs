import mongoose from 'mongoose'

const connectionURL = process.env.MOGODB_CONNECTION_URL!

mongoose.connect(connectionURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})