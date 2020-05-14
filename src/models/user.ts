import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose, pre, ReturnModelType } from '@typegoose/typegoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { query } from 'express'

@pre<User>('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
export class User {
    @prop({
        required: true,
        trim: true
    })
    name!: string

    @prop({
        required: true,
        default: 0,
        validate: {
            validator: (value) => {
                return value >= 0
            },
            message: "Age must be a positive number"
        } 
    })
    age!: number

    @prop({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: "Email is invalid"
        }
    })
    email!: string

    @prop({
        required: true,
        trim: true,
        validate: [
            {
                validator(value) {
                    return value.length > 6
                },
                message: "Password should be longer than 6 characters"
            },
            {
                validator(value) {
                    return !value.toLowerCase().includes('password')
                },
                message: "Password should not caontain 'password'"
            },
        ]
    })
    password!: string

    public static async findByCredentials(this: ReturnModelType<typeof User>, email: string, password: string) {
        const user = await this.findOne({ email })
        if (!user) {
            throw new Error('Unable to login')
        }
    
        const isMatch = await bcrypt.compare(password, user.password)
    
        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return user
    }
}

const userSchema = buildSchema(User)
export const UserModel = addModelToTypegoose(mongoose.model('User', userSchema), User)