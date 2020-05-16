import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { UserModel } from '../../src/models/user'
import { TaskModel } from '../../src/models/task'

export const userOneId = mongoose.Types.ObjectId()
export const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'whatareyoutalkingabout',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JSON_WEB_TOKEN_SECRET!)
    }]
}

export const userTwoId = mongoose.Types.ObjectId()
export const userTwo = {
    _id: userTwoId,
    name: 'Mark',
    email: 'mark@example.com',
    password: 'whatareyoutalkingaboutmark',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JSON_WEB_TOKEN_SECRET!)
    }]
}

export const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOneId
}

export const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOneId
}

export const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: true,
    owner: userTwoId
}

export const fakeUserOne = {
    name: 'Tom',
    email: 'tom@example.com',
    password: 'fakeusertom'
}

export const setupDatabase = async () => {
    await UserModel.deleteMany({})
    await TaskModel.deleteMany({})
    await new UserModel(userOne).save()
    await new UserModel(userTwo).save()
    await new TaskModel(taskOne).save()
    await new TaskModel(taskTwo).save()
    await new TaskModel(taskThree).save()
}