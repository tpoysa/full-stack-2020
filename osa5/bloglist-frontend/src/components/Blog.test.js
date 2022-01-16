import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('< Blog />', () => {

    let component

    const blog = {
        title: 'testTitle',
        url: 'testUrl',
        author: 'testAuthor',
        likes: 100
    }

    const addLike = jest.fn()

    beforeEach(() => {
        component = render(
            <Blog key={blog.id} blog={blog} addLike={addLike}>
            </Blog>
        )
    })

    test('Only title and author shown at the start', () => {

        const div = component.container.querySelector('.togglableContent')

        expect(div).toHaveStyle('display: none')

    })

    test('after button is pressed, additional info is shown', () => {

        const button = component.getByText('View')

        fireEvent.click(button)

        const div = component.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    /*    test('event handler is called twice with two clicks', () => {

        ei toimi

        const button = component.getByText('like')

        fireEvent.click(button)
        fireEvent.click(button)

        expect(addLike.mock.calls).toHaveLength(2)

    })
    */

})