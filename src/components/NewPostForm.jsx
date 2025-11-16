import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewPostForm.css'
import './Toast.css'

function NewPostForm({ onCreate, initialDraft }) {
    const [title, setTitle] = useState(initialDraft ? (initialDraft.title || '') : '')
    const [category, setCategory] = useState(initialDraft ? (initialDraft.category || '') : '')
    const [tagsInput, setTagsInput] = useState(initialDraft ? ((initialDraft.tags || []).join(', ')) : '')
    const [content, setContent] = useState(initialDraft ? (initialDraft.content || '') : '')
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

        // if this publish corresponds to an existing draft, remove it
        try{
            const raw = localStorage.getItem('draftEntries')
            const drafts = raw ? JSON.parse(raw) : []
            if (initialDraft && initialDraft.id) {
                const remaining = drafts.filter(d => d.id !== initialDraft.id)
                try{ localStorage.setItem('draftEntries', JSON.stringify(remaining)) }catch(e){}
                try{ window.dispatchEvent(new CustomEvent('draftsUpdated', { detail: remaining })) }catch(e){}
            }
        }catch(e){}

        // reset form
        setTitle('')
        setCategory('')
        setTagsInput('')
        setContent('')

        // go back to feed so user sees the new post
        navigate('/home')
    }

    function handleSaveDraft() {
        try{
            const tags = tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)

            const draft = {
                id: initialDraft && initialDraft.id ? initialDraft.id : Date.now(),
                title: title || '(Untitled)',
                category: category || '',
                tags,
                content: content || '',
                savedAt: Date.now(),
            }

            const raw = localStorage.getItem('draftEntries')
            const drafts = raw ? JSON.parse(raw) : []

            // if editing existing draft, replace it
            const exists = drafts.find(d => d.id === draft.id)
            let updated
            if (exists) {
                updated = drafts.map(d => d.id === draft.id ? draft : d)
            } else {
                updated = [draft, ...drafts]
            }

            try{ localStorage.setItem('draftEntries', JSON.stringify(updated)) }catch(e){}
            try{ window.dispatchEvent(new CustomEvent('draftsUpdated', { detail: updated })) }catch(e){}
            // keep form intact but show a small confirmation
            try{ showToast('Draft saved to My Notes') }catch(e){}
            // close form and go back to home so user sees their saved drafts list
            try{ navigate('/home') }catch(e){}
        }catch(e){ console.error('save draft failed', e) }
    }

    // small non-blocking toast helper (uses styles from Toast.css)
    function showToast(message, timeout = 3000){
        try{
            let container = document.querySelector('.app-toast-container')
            if (!container){
                container = document.createElement('div')
                container.className = 'app-toast-container'
                document.body.appendChild(container)
            }
            const el = document.createElement('div')
            el.className = 'app-toast'
            el.textContent = message
            container.appendChild(el)
            // auto-remove
            setTimeout(()=>{
                el.classList.add('hide')
                setTimeout(()=>{ try{ container.removeChild(el) }catch(e){} }, 260)
            }, timeout)
        }catch(e){ console.error('showToast failed', e) }
    }

    return (
        <div className="new-post-form container">
            <h1 className="page-title">Create a New Entry Using Feynman Technique</h1>

            <form className="post-form" onSubmit={handleSubmit}>
                <section className="form-section concept-section">
                    <h2 className="section-title">What concept are you studying?</h2>
                    <div className="field-row">
                        <div className="field">
                            <label className="field-label">Entry Title</label>
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
                    <p className="section-help">Add tags to help others find your entry (comma separated).</p>
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
                        <button className="btn-secondary" type="button" onClick={handleSaveDraft}>Save Draft</button>
                    </div>
                    <div className="right-footer">
                        <p className="xp-note">+50 XP on publish</p>
                        <button className="btn-primary" type="submit">Create Entry</button>
                    </div>
                </footer>
            </form>
        </div>
    )
}

export default NewPostForm