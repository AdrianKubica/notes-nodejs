import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose, Ref } from '@typegoose/typegoose'
import { User } from './user'

export class Task {
    @prop({
        required: true,
        trim: true
    })
    description!: string

    @prop({
        default: false
    })
    completed!: boolean

    @prop({
        required: true,
        ref: 'User'
    })
    public owner!: Ref<User>
}

const taskSchema = buildSchema(Task)
export const TaskModel = addModelToTypegoose(mongoose.model('Task', taskSchema), Task)