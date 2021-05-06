const likes = (blog) => {
    return blog.likes
}

// eslint-disable-next-line no-unused-vars
const dummy = (_blogs) => {
    return 1
}

const totalLikes = (blogs) => {



    const reducer = (sum, next) => {
        return sum + next
    }

    return blogs.map(likes).reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {

    const reducer = (max, next) => {
        if (likes(next) > likes(max)) {
            return next
        }
        else {
            return max
        }
    }

    return blogs.length === 0
        ? undefined
        : blogs.map(blog => blog).reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}