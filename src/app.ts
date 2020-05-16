import express from 'express'
import './db/mongoose'
import allRouter from './routers/all'
import taskRouter from './routers/task'
import userRouter from './routers/user'

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(allRouter)

export default app