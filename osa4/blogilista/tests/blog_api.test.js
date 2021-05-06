const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const _ = require('lodash')

const blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

beforeEach(async () => {

    await Blog.deleteMany({})

    for (let blog of blogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
      }
})

describe('blog api GET tests', () => {

    test('correct number of blogs returned', async () => {

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(6)

    })

    test('correct id field returned', async () => {

        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

})

describe('blog api POST tests', () => {

    blogToAdd = {
        title: 'Blog 1',
        author: 'Tester',
        url: 'www.google.com',
        likes: 5,
    }

    test('succeeds with valid data', async () => {

        await api
            .post('/api/blogs')
            .send(blogToAdd)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const totalBlogs = await api.get('/api/blogs')
        
        expect(totalBlogs.body).toHaveLength(blogs.length + 1)
        expect(_.last(totalBlogs.body).title).toBe('Blog 1')
    })

})



afterAll(() => {
    mongoose.connection.close()
  })