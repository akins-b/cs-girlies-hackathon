import React from 'react'
import NewPostForm from '../components/NewPostForm.jsx'

function NewPost({ onCreate }) {
    return <NewPostForm onCreate={onCreate} />
}

export default NewPost