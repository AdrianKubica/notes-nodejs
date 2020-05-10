import express from 'express'
import './db/mongoose'
import { UserModel } from './models/user'
import { TaskModel } from './models/task'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new UserModel(req.body)
    user.save().then(result => {
        res.send(user)
    }).catch(error => {
        res.status(400).send(error)
    })
})

app.post('/tasks', (req, res) => {
    const task = new TaskModel(req.body)
    task.save().then(response => {
        res.send(task)
    }).catch(error => {
        res.status(400).send(error)
    })
})

app.listen(port, ()=> {
    console.log(`Server started on port: ${port}`)
})