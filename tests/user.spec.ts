import request from 'supertest'
import app from '../src/app'
import { UserModel } from '../src/models/user'
import { userOneId, userOne, fakeUserOne, setupDatabase } from './fixtures/db'

beforeEach(setupDatabase)

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
        token: user!.tokens[0].token
    })

    expect(user!.password).not.toBe('somesuperpass')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await UserModel.findById({ _id: response.body.user._id })
    expect(response.body.token).toBe(user!.tokens[1].token)
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

describe('POST /users/me/avatar', () => {
    it('Should upload avatar image', async() => {
        await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

        const user = await UserModel.findById(userOneId)
        expect(user!.avatar).toEqual(expect.any(Buffer))
    })
})

describe('PATCH /users/me', () => {
    it('Should properly update user', async () => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Adam'
            })
            .expect(200)

        const user = await UserModel.findById(userOneId)
        expect(user!.name).toBe('Adam')
    })

    it('Should not update invalid user fileds', async () => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                field: "this should not be updated"
            })
            .expect(400, {
                error: 'Invalid updates, only allowed: name, email, password, age'
            })
    })
})