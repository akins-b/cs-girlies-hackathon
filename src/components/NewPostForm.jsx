import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewPostForm.css'

function NewPostForm({ onCreate }) {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [tagsInput, setTagsInput] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)

        if (!title || !content) {
            // basic validation
            alert('Please provide a title and some content.')
            return
        }

        const newPost = {
            title,
            content,
            tags,
            category,
        }

        if (typeof onCreate === 'function') {
            onCreate(newPost)
        }

        // reset form
        setTitle('')
        setCategory('')
        setTagsInput('')
        setContent('')

        // go back to feed so user sees the new post
        navigate('/home')
    }

    return (
        <div className="new-post-form container">
            <h1 className="page-title">Create a New Post Using Feynman Technique</h1>

            <form className="post-form" onSubmit={handleSubmit}>
                <section className="form-section concept-section">
                    <h2 className="section-title">What concept are you studying?</h2>
                    <div className="field-row">
                        <div className="field">
                            <label className="field-label">Post Title</label>
                            <input
                                className="field-input"
                                type="text"
                                placeholder="e.g. Cloud Computing"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="field-label">Category/Subject</label>
                            <select
                                className="field-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                <option value="physics">Physics</option>
                                <option value="math">Math</option>
                                <option value="cs">Computer Science</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="form-section tags-section">
                    <h3 className="section-subtitle">Tags</h3>
                    <p className="section-help">Add tags to help others find your post (comma separated).</p>
                    <div className="tags-input-row">
                        <input
                            className="tags-input"
                            type="text"
                            placeholder="e.g. quantum, physics, intro"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                        <small className="tags-hint">Press Enter or separate with commas</small>
                    </div>
                </section>

                <section className="form-section explain-section">
                    <h2 className="section-title">Explain the concept in simple terms</h2>
                    <p className="section-help">Explain it simply as if you were teaching a beginner.</p>
                    <textarea
                        className="field-textarea"
                        rows="6"
                        placeholder="Write your explanation here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </section>

                <footer className="form-footer">
                    <div className="left-footer">
                        <button className="btn-secondary" type="button">Save Draft</button>
                    </div>
                    <div className="right-footer">
                        <p className="xp-note">+50 XP on publish</p>
                        <button className="btn-primary" type="submit">Create Post</button>
                    </div>
                </footer>
            </form>
        </div>
    )
}

export default NewPostForm