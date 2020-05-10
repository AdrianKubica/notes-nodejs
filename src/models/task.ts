import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose } from '@typegoose/typegoose'

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
}

const taskSchema = buildSchema(Task)
export const TaskModel = addModelToTypegoose(mongoose.model('Task', taskSchema), Task)