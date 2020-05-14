import express from 'express'
import { UserModel, User } from '../models/user'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new UserModel(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find()
        return res.send(users)
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await UserModel.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(el => allowedUpdates.includes(el))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Invalid updates, only allowed: ${allowedUpdates.join(', ')}`
        })
    }

    try {
        const user = await UserModel.findById(req.params.id)

        if (!user) {
            return res.sendStatus(404)
        }

        updates.forEach((update) => user.set(update, req.body[update]))
        await user.save()

        res.send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.sendStatus(404)
        }
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router