import express from 'express'
import { UserModel } from '../models/user'
import { auth } from '../middleware/auth'

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new UserModel(req.body)
    try {
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token: any) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch(error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Logout from all sessions')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(el => allowedUpdates.includes(el))

    if (!isValidOperation) {
        return res.status(400).send({
            error: `Invalid updates, only allowed: ${allowedUpdates.join(', ')}`
        })
    }

    try {
        updates.forEach((update) => req.user.set(update, req.body[update]))
        await req.user.save()

        res.send(req.user)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router