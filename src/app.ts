import express from 'express'
import './db/mongoose'
import allRouter from './routers/all'
import taskRouter from './routers/task'
import userRouter from './routers/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(allRouter)

app.listen(port, ()=> {
    console.log(`Server started on port: ${port}`)
})

const myfunction = async() => {
    const password = 'Red123456'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare(password, hashedPassword)
    console.log(isMatch)
}

myfunction()