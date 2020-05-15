import express, { response, Request, Response } from 'express'
import { UserModel } from '../models/user'
import { auth } from '../middleware/auth'
import multer from 'multer'
import sharp from 'sharp'
import { sendWelcomeEmail, sendCancelationEmail } from '../emails/account'

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new UserModel(req.body)
    try {
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
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
        sendCancelationEmail(req.user.email, req.user.name)
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a avatar in jpg|jpeg|png format'))
        }
        cb(null, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send({error: 'Please provide an avatar'})
    }

    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error: Error, req: Request, res: Response, next: Function) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req: Request, res: Response) => {
    req.user.avatar = undefined
    try {
        await req.user.save()
        res.send('Avatar deleted successfully')
    } catch (error) {
        res.status(500).send({error: 'Unable to delete avatar'})
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.setHeader('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

export default router