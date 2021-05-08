const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_request, response) => {

    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', async (request, response) => {

    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)

})

blogsRouter.delete('/:id', async (request, response) => {

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).send()

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