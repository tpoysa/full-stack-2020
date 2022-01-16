import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

const App = () => {

    const [blogs, setBlogs] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const blogRef = useRef()



    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const loginForm = () => {

        return (
            <div>
                <Togglable buttonLabel="Login">
                    <LoginForm
                        username={username}
                        password={password}
                        usernameHandler={({ target }) => setUsername(target.value)}
                        passwordHandler={({ target }) => setPassword(target.value)}
                        loginHandler={handleLogin}
                    />
                </Togglable>

            </div>
        )

    }

    const blogForm = () => {

        return(
            <div>
                <Togglable buttonLabel="Create a new blog" ref={blogRef}>
                    <BlogForm createBlog={createBlog}/>
                </Togglable>
            </div>
        )
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(errorMessage)
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()

        window.localStorage.removeItem('loggedUser')
        blogService.setToken(null)
        setUser(null)
        setUsername('')
        setPassword('')
    }

    const createBlog = (blogObject) => {

        try {
            const response = blogService
                .create(blogObject)
                .then(newBlog => {setBlogs(blogs.concat(newBlog))
                    setSuccessMessage(`${blogObject.title} by ${blogObject.author} added`)
                    setTimeout(() => {
                        setSuccessMessage(null)
                    }, 5000)
                })
                .catch(() => {setErrorMessage('Adding a new blog failed')
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)})

            blogRef.current.toggleVisibility()

            console.log(response)

        }
        catch (exception)
        {
            setErrorMessage('Adding a new blog failed')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }

    }

    const addLike = (blogObject) => {

        const response = blogService
            .update(blogObject)
            .then(() => {setBlogs(blogs)
                setSuccessMessage(`Like added for ${blogObject.title} by ${blogObject.author}`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch(() => {setErrorMessage('Adding a like failed')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)})

        //console.log(response)

        return response

    }


    return (
        <div>
            <h2>Blogs</h2>
            <Notification message={successMessage} type={'success'}/>
            <Notification message={errorMessage} type={'error'}/>
            {user === null ?
                loginForm() :
                <div>
                    <p>logged in as {user.username} <button onClick={handleLogout}>Log out</button></p>
                    {blogForm()}
                </div>
            }
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} addLike={addLike} />
            )}
        </div>
    )
}

export default App