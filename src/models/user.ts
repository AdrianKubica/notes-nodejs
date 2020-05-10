import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose } from '@typegoose/typegoose'
import validator from 'validator'

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
}

const userSchema = buildSchema(User)
export const UserModel = addModelToTypegoose(mongoose.model('User', userSchema), User)