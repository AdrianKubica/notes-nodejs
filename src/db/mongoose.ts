import mongoose from 'mongoose'

const connecttionURL = 'mongodb://192.168.99.110/task-manager-api'

mongoose.connect(connecttionURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})