import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObj => {

    const cfg = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObj, cfg)
    return response.data
}

const update = async obj => {

    const response = await axios.put(baseUrl + `/${obj.id}`, obj)
    return response.data
}

export default { getAll, setToken, create, update }