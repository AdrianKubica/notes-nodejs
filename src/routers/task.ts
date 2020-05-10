import express from 'express'
import { TaskModel } from "../models/task"

const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = new TaskModel(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.sendStatus(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find()
        res.send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await TaskModel.findById(_id)
        if (!task) {
            return res.sendStatus(404)
        }
        res.send(task)
    } catch(error) {
        res.sendStatus(500).send(error)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(el => allowedUpdates.includes(el))

    if (!isValidOperation) {
        res.status(400).send({
            error: `Invalid updates, only allowed: ${allowedUpdates.join(', ')}`
        })
    }

    try {
        const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.sendStatus(404)
        }
        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const tasks = await TaskModel.findByIdAndDelete(req.params.id)
        if (!tasks) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
})

export { router }