import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import app from '../src/app'
import { UserModel } from '../src/models/user'

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'whatareyoutalkingabout',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JSON_WEB_TOKEN_SECRET!)
    }]
}

const fakeUserOne = {
    name: 'Tom',
    email: 'tom@example.com',
    password: 'fakeusertom'
}

beforeEach(async () => {
    await UserModel.deleteMany({})
    await new UserModel(userOne).save()
})

test('Should signup a new user', async () => {
    const response: any = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'somesuperpass'
    }).expect(201)

    const counter = await UserModel.countDocuments({_id: response.body.user._id})
    expect(counter).toBe(1)

    const user = await UserModel.findById({_id: response.body.user._id})
    expect(user).not.toBeNull()

    expect(response.body.user.name).toBe('Andrew')
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user?.tokens[0].token
    })

    expect(user?.password).not.toBe('somesuperpass')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await UserModel.findById({ _id: response.body.user._id })
    expect(response.body.token).toBe(user?.tokens[1].token)
})

describe('POST /users/login', () => {
    it('Should not login not existing user', async () => {
        await request(app).post('/users/login').send({
            email: fakeUserOne.email,
            password: fakeUserOne.password
        }).expect(400, {
            error: 'Unable to login'
        })
    })
})

describe('GET /users/me', () => {
    it('Should get profile for user', async() => {
        await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    })

    it('Should not return profile info if user is not authenticated', async() => {
        await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer SOMEWRONGJWTTOKEN`)
            .send()
            .expect(401, {
                error: 'Please authenticate'
            })
    })

    it('Should not return profile info if user is not authenticated (lack of authorization header)', async() => {
        await request(app)
            .get('/users/me')
            .send()
            .expect(401, {
                error: 'Please authenticate'
            })
    })
})

describe('DELETE /users/:id', () => {
    it.each`
    authToken                  | status
    ${userOne.tokens[0].token} | ${204}
    ${'NOTAUTHENTICATED'}      | ${401}
    `
    ('Should return correct status $status due to user profile deletion and user authentication', async ({authToken, status}) => {
        await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${authToken}`)
            .send()
            .expect(status)

        const user = await UserModel.findById(userOneId)

        if (status == 204) {
            expect(user).toBeNull()
        } else if (status == 401) {
            expect(user).not.toBeNull()
        }
    })
})