import request from 'supertest'
import { TaskModel } from '../src/models/task'
import app from '../src/app'
import { userOneId, userOne, userTwo, userTwoId, fakeUserOne, setupDatabase, taskOne, taskThree } from './fixtures/db'

beforeEach(setupDatabase)

describe('POST /tasks', () => {
    it('Should create task for user', async () => {
        const taskToSave = {
            description: 'First task',
            completed: false
        }
        const response: any = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send(taskToSave)
            .expect(201)

        const taskCounter = await TaskModel.countDocuments({})
        expect(taskCounter).toBe(4)
        
        const task = await TaskModel.findById({_id: response.body._id})
        expect(task).not.toBeNull()

        expect(task).toMatchObject(taskToSave)
    })
})

describe('GET /tasks', () => {
    it.each`
        user       | taskCounter
        ${userOne} | ${2}
        ${userTwo} | ${1}
    `('Should get $taskCounter tasks for user: $user.name', async ({user, taskCounter}) => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200)

        const counter = await TaskModel.countDocuments({owner: user._id})
        expect(counter).toBe(taskCounter)

        expect(response.body.length).toBe(taskCounter)
    })
})

describe('DELETE /tasks/:id', () => {
    it.each`
        user       | status | body                    | expectedTask
        ${userOne} | ${404} | ${{error: 'Not Found'}} | ${taskThree}
        ${userTwo} | ${204} | ${{}}                   | ${null}
    `('Should allow delete task only by task owner', async ({user, status, body, expectedTask}) => {
        await request(app)
            .delete(`/tasks/${taskThree._id}`)
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(status, body)

        const task = await TaskModel.findById({ _id: taskThree._id})
        user === userOne ? expect(task).toMatchObject(expectedTask) : expect(task).toBeNull()
    })
})