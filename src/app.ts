import express from 'express'
import './db/mongoose'
import { UserModel } from './models/user'
import { TaskModel } from './models/task'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new UserModel(req.body)
    user.save().then(user => {
        res.sendStatus(201).send(user)
    }).catch(error => {
        res.sendStatus(400).send(error)
    })
})

app.get('/users', (req, res) => {
    UserModel.find().then(users => {
        res.send(users)
    }).catch(error => {
        res.sendStatus(500).send(error)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    UserModel.findById(_id).then(user => {
        if(!user) {
            return res.status(404).send()
        }
        res.sendStatus(200).send(user)
    }).catch(error => {
        res.sendStatus(500).send(error)
    })
})

app.post('/tasks', (req, res) => {
    const task = new TaskModel(req.body)
    task.save().then(task => {
        res.sendStatus(201).send(task)
    }).catch(error => {
        res.sendStatus(400).send(error)
    })
})

app.get('/tasks', (req, res) => {
    TaskModel.find().then(tasks => {
        res.send(tasks)
    }).catch(error => {
        res.sendStatus(500).send(error)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    TaskModel.findById(_id).then(task => {
        if (!task) {
            return res.sendStatus(404).send()
        } else {
            return res.send(task)
        }
    }).catch(error => {
        res.sendStatus(500).send(error)
    })
})

app.listen(port, ()=> {
    console.log(`Server started on port: ${port}`)
})