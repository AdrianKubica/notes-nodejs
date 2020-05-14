import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user"

export const auth = async (req: Request, res: Response, next: Function) => {
    try {
        const token = req.header('authorization')!.replace('Bearer ', '')
        const decoded: any = jwt.verify(token, 'thisismynewcourse')
        const user = await UserModel.findOne({_id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        
        req.token = token
        req.user = user
        next()
    } catch (err) {
        return res.status(401).send({ error: 'Please authenticate' })
    }
}