const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_data')
const _ = require('lodash')

beforeEach(async () => {

    await Blog.deleteMany({})
    await Blog.insertMany(helper.blogs)
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

    test('succeeds with valid data', async () => {

        await api
            .post('/api/blogs')
            .send(helper.blogToAdd)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const totalBlogs = await api.get('/api/blogs')

        expect(totalBlogs.body).toHaveLength(helper.blogs.length + 1)

        expect(_.last(totalBlogs.body).title).toBe(helper.blogToAdd.title)
        expect(_.last(totalBlogs.body).author).toBe(helper.blogToAdd.author)
        expect(_.last(totalBlogs.body).url).toBe(helper.blogToAdd.url)
        expect(_.last(totalBlogs.body).likes).toBe(helper.blogToAdd.likes)

    })

    test('if likes is not specified, it is set at 0', async () => {

        const response = await api.post('/api/blogs').send(helper.blogWithoutLikes)
        expect(response.body.likes).toBe(0)

    })

    test('POST request without title and url returns 400 Bad Request', async () => {

        const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl)
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

        let blogs = await Blog.find({})
        let blogToDelete = _.last(blogs)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .send()
            .expect(204)

        blogs = await Blog.find({})
        expect(blogs.length).toBe(helper.blogs.length - 1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})