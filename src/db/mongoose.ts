import mongoose from 'mongoose'
import { prop, buildSchema, addModelToTypegoose } from '@typegoose/typegoose'

const connecttionURL = 'mongodb://192.168.99.110/task-manager-api'

mongoose.connect(connecttionURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})

export class User {
    @prop({ required: true })
    name!: string
    @prop({ required: true })
    age!: number
}

const userSchema = buildSchema(User)
const UserModel = addModelToTypegoose(mongoose.model('User', userSchema), User)

const user = new UserModel({
    name: 'Adrian'
})

user.save().then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})

// interface User {
//     name: string,
//     age: number
//   }
  
// const definition: ModelDefinition<User> = {
//     name: { type: String, required: true },
//     age: { type: Number, required: true },
// };
  
// const userSchema = new mongoose.Schema(definition)
// const User = mongoose.model<User & mongoose.Document>('User', userSchema)

// const me = new User({
//     name: 28,
//     age: 'mike'
// })

// me.save().then(result => {
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })

// interface Test {
//     testa: string
// }

// interface Task {
//     description: string,
//     completed: boolean,
//     test: Test
// }

// const taskDefinition: ModelDefinition<Task> = {
//     description: { type: String, required: true },
//     completed: { type: Boolean, required: true },
//     test: {type: String, required: true}
// }

// const taskSchema = new mongoose.Schema(taskDefinition)
// const Task = mongoose.model<Task & mongoose.Document>('Task', taskSchema)

// const task = new Task({
//     description: "First task",
//     completed: true
// })

// task.save().then(result => {
//     console.log('Saved')
// }).catch(error => {
//     console.log('Unable to save')
// })