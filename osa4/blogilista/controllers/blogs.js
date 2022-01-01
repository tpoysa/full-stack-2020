const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (_request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', async (request, response) => {

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const blog = new Blog(request.body)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result.toJSON())

})

blogsRouter.delete('/:id', async (request, response) => {

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user =  await User.findById(decodedToken.id)


    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user._id.toString()) {
        await blog.delete()
        response.status(204).send()
    } else {
        response.status(400).send()
    }

})

blogsRouter.put('/:id', async (request, response) => {

    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(result)
})

module.exports = blogsRouter