import React from 'react'
import { useLocation } from 'react-router-dom'
import NewPostForm from '../components/NewPostForm.jsx'

function NewPost({ onCreate }) {
    const loc = useLocation()
    const state = loc.state || {}
    // allow editing a draft by passing it as initialDraft in navigation state
    const { initialDraft } = state
    return <NewPostForm onCreate={onCreate} initialDraft={initialDraft} />
}

export default NewPost