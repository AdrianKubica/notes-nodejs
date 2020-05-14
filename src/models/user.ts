import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose, pre, ReturnModelType, getModelForClass, getDiscriminatorModelForClass, arrayProp, DocumentType } from '@typegoose/typegoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class Token {
    @prop({
        required: true
    })
    token!: string
}

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

    @arrayProp({
        items: Token
    })
    tokens!: Token[]

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

    public async generateAuthToken(this: DocumentType<User>) {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    }

    public toJSON(this: DocumentType<User>) {
        const user = this
        const userObject = user.toObject()

        delete userObject.password
        delete userObject.tokens

        return userObject
    }
}

const userSchema = buildSchema(User)
export const UserModel = addModelToTypegoose(mongoose.model('User', userSchema), User)