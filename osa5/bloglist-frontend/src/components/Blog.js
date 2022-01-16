import React from 'react'
import { useState } from 'react'
import propTypes from 'prop-types'


const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
}

const Blog = ({ blog, addLike }) => {

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }



    const setLikes = (event) => {
        event.preventDefault()

        blog.likes = blog.likes + 1

        try {
            addLike({
                user: blog.user.id,
                likes: blog.likes,
                author: blog.author,
                title: blog.title,
                url: blog.url,
                id: blog.id
            })

            toggleVisibility()

        }
        catch (exception) {
            console.log(exception)
        }

        Blog.propTypes = {

            addLike: propTypes.func.isRequired,
            blog: propTypes.object.isRequired
        }


    }

    return(
        <div>
            <div style ={hideWhenVisible}>
                <div style={blogStyle}>
                    <div>
                        {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
                    </div>
                </div>
            </div>
            <div style={showWhenVisible} className='togglableContent'>
                <div style={blogStyle}>
                    <div>
                        <p >{blog.title} {blog.author} <button onClick={toggleVisibility}>Hide</button></p>
                        <p>{blog.url}</p>
                        <p>likes {blog.likes} <button id='likeButton' onClick={setLikes}>like</button></p>
                        <p>{blog.author}</p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Blog