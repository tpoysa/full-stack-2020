const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (_request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', async (request, response) => {

    const blog = new Blog(request.body)
    //const user = await User.findById(request.body.userId)
    const user = await User.findOne()

    blog.user = user._id
    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result.toJSON())

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