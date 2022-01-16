import React from 'react'

const style = {
    paddingTop: 15,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 3,
    marginBottom: 10,
}


const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={`${type}`} style={style}>
            {message}
        </div>
    )
}

export default Notification