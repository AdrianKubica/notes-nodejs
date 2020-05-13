import express from 'express'
import './db/mongoose'
import allRouter from './routers/all'
import taskRouter from './routers/task'
import userRouter from './routers/user'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(allRouter)

app.listen(port, ()=> {
    console.log(`Server started on port: ${port}`)
})