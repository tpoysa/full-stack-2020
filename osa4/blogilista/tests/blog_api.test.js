const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_data')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const credentials = {
    username: 'root',
    password: 'sekret'
}

const wrongCredentials = {
    username: 'root',
    password: 'wrongsekret'
}

beforeEach(async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Mr. Root',  passwordHash: passwordHash })
    await user.save()

    const dbUser = await User.findOne({ username: 'root' })

    //Mark all initial blogs to be created by user 'root'
    const blogsToAdd = _.map(helper.blogs, blog => _.assign({}, blog, { user: dbUser._id.toString() }))

    await Blog.deleteMany({})
    await Blog.insertMany(blogsToAdd)
})

describe('blog api GET tests', () => {

    test('correct number of blogs returned', async () => {

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.blogs.length)

    })

    test('correct id field returned', async () => {

        const response = await api.get('/api/blogs')
        expect(_.first(response.body).id).toBeDefined()

    })

})

describe('blog api POST tests', () => {



    test('Login succeeds with valid credentials', async () => {

        const response =
            await api
                .post('/api/login')
                .send(credentials)
                .expect(200)

        expect(response.body.token).toBeDefined()
    })

    test('Login fails with invalid credentials', async () => {

        const response =
            await api
                .post('/api/login')
                .send(wrongCredentials)
                .expect(401)

        expect(response.body.token).toBeUndefined()
    })

    test('succeeds with valid data', async () => {

        const tokenResponse = await api.post('/api/login').send(credentials)
        const token = tokenResponse.body.token

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(helper.blogToAdd)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const totalBlogs = await Blog.find({})

        expect(totalBlogs).toHaveLength(helper.blogs.length + 1)

        expect(_.last(totalBlogs).title).toBe(helper.blogToAdd.title)
        expect(_.last(totalBlogs).author).toBe(helper.blogToAdd.author)
        expect(_.last(totalBlogs).url).toBe(helper.blogToAdd.url)
        expect(_.last(totalBlogs).likes).toBe(helper.blogToAdd.likes)

    })

    test('if likes is not specified, it is set at 0', async () => {

        const tokenResponse = await api.post('/api/login').send(credentials)
        const token = tokenResponse.body.token

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(helper.blogWithoutLikes)
        expect(response.body.likes).toBe(0)

    })

    test('POST request without title and url returns 400 Bad Request', async () => {

        const tokenResponse = await api.post('/api/login').send(credentials)
        const token = tokenResponse.body.token

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(helper.blogWithoutTitleAndUrl)
        expect(response.statusCode).toBe(400)
    })

})

describe('blog api PUT tests', () => {

    test('succeeds with valid data and id', async () => {

        let blogs = await Blog.find({})
        let blogToUpdate = _.first(blogs)

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(helper.blogToPut)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        blogs = await Blog.find({})
        blogToUpdate = _.first(blogs)

        expect(blogToUpdate.title).toBe(helper.blogToPut.title)
        expect(blogToUpdate.author).toBe(helper.blogToPut.author)
        expect(blogToUpdate.url).toBe(helper.blogToPut.url)
        expect(blogToUpdate.likes).toBe(helper.blogToPut.likes)
    })

})

describe('blog api DELETE tests', () => {


    test('succeeds with a valid id', async () => {

        const tokenResponse = await api.post('/api/login').send(credentials)
        const token = tokenResponse.body.token

        let blogs = await Blog.find({})
        let blogToDelete = _.last(blogs).toJSON()

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .send()
            .expect(204)

        blogs = await Blog.find({})
        expect(blogs.length).toBe(helper.blogs.length - 1)
    })
})

describe('user api tests', () => {

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('GET request returns correct number of users', async () => {

        const response = await api.get('/api/users')
        expect(response.body.length).toBe(1)
    })

    test('creation fails with proper statuscode and message if name is missing', async () => {

        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root2',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`name` is required')
        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {

        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root2',
            name: 'tester 1',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password is too short')
        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})