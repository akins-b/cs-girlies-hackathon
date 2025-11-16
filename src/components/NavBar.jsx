import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';

function NavBar({ user }) {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState({ posts: [], users: [], tags: [] })
    const [open, setOpen] = useState(false)
    const inputRef = useRef(null)
    const containerRef = useRef(null)
    const debounceRef = useRef(null)

    const getInitials = () => {
        if (!user) return 'JS'
        const { firstName = '', lastName = '', name = '', username = '' } = user
        if (firstName || lastName) {
            const a = firstName ? firstName.trim()[0] : (name ? name.trim().split(' ')[0][0] : (username ? username[0] : 'J'))
            const b = lastName ? lastName.trim()[0] : (firstName && firstName.trim().split(' ')[1] ? firstName.trim().split(' ')[1][0] : (name && name.trim().split(' ')[1] ? name.trim().split(' ')[1][0] : 'S'))
            return ((a||'') + (b||'')).toUpperCase()
        }
        if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
        if (username) return username.slice(0,2).toUpperCase()
        return 'JS'
    }

    const initials = getInitials()

    useEffect(()=>{
        const onDocClick = (e)=>{
            if (!containerRef.current) return
            if (!containerRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('click', onDocClick)
        return ()=> document.removeEventListener('click', onDocClick)
    }, [])

    useEffect(()=>{
        if (!query || query.trim().length < 1) {
            setResults({ posts: [], users: [], tags: [] })
            return
        }
        // debounce
        try{ if (debounceRef.current) clearTimeout(debounceRef.current) }catch(e){}
        debounceRef.current = setTimeout(()=>{
            try{
                const q = query.trim().toLowerCase()
                // load posts
                const rawPosts = localStorage.getItem('posts')
                const posts = rawPosts ? JSON.parse(rawPosts) : []
                const matchedPosts = posts.filter(p=>{
                    try{
                        const title = (p.title||'').toLowerCase()
                        const content = (p.content||'').toLowerCase()
                        const tags = Array.isArray(p.tags) ? p.tags.map(t=>String(t).toLowerCase()) : []
                        if (title.includes(q) || content.includes(q)) return true
                        if (tags.some(t=>t.includes(q))) return true
                    }catch(e){}
                    return false
                }).slice(0,7)

                // tags: collect unique tags and match those containing q
                const allTags = new Set()
                try{ posts.forEach(p=> (Array.isArray(p.tags) ? p.tags : []).forEach(t=> allTags.add(String(t))) ) }catch(e){}
                const matchedTags = Array.from(allTags).filter(t=> String(t).toLowerCase().includes(q)).slice(0,10)

                // users: search per-username profile map
                const rawMap = localStorage.getItem('user_profiles')
                const map = rawMap ? JSON.parse(rawMap) : {}
                const users = Object.values(map || {})
                const matchedUsers = users.filter(u=>{
                    try{
                        const uname = (u.username||'').toLowerCase()
                        const name = (u.name||'').toLowerCase()
                        return uname.includes(q) || name.includes(q)
                    }catch(e){ return false }
                }).slice(0,6)

                setResults({ posts: matchedPosts, users: matchedUsers, tags: matchedTags })
                setOpen(true)
            }catch(e){ console.error('search failed', e); setResults({ posts:[], users:[], tags:[] }); setOpen(false) }
        }, 220)

        return ()=>{ try{ if (debounceRef.current) clearTimeout(debounceRef.current) }catch(e){} }
    }, [query])

    const goToPost = (id) => {
        setOpen(false)
        navigate(`/post/${id}`)
    }

    const viewUser = (username)=>{
        setOpen(false)
        navigate(`/profile/${encodeURIComponent(username)}`)
    }

    const searchTag = (tag)=>{
        setOpen(false)
        navigate(`/tag/${encodeURIComponent(tag)}`)
    }

    return (
        <header className="nav">
            <div className="nav-left">
                <Link to='/home' className="brand">LearnSpace</Link>
            </div>

            <div className="nav-center" ref={containerRef}>
                <label htmlFor="nav-search-input" className="visually-hidden">Search</label>
                <input id='nav-search-input' ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>{ if (query && query.length>0) setOpen(true) }} className="nav-search" placeholder="Search topics, entries..." aria-label="Search" />

                {open && ( (results.posts.length>0) || (results.users.length>0) || (results.tags.length>0) ) && (
                    <div className="nav-search-dropdown" role="listbox">
                        {results.users.length>0 && (
                            <div className="search-section users">
                                <div className="section-title">People</div>
                                {results.users.map(u=> (
                                    <button key={u.username} className="search-item" onClick={()=>viewUser(u.username)}>{u.name || u.username} <span className="muted">@{u.username}</span></button>
                                ))}
                            </div>
                        )}

                        {results.tags.length>0 && (
                            <div className="search-section tags">
                                <div className="section-title">Tags</div>
                                {results.tags.map(t=> (
                                    <button key={t} className="search-item" onClick={()=>searchTag(t)}>#{t}</button>
                                ))}
                            </div>
                        )}

                        {results.posts.length>0 && (
                            <div className="search-section posts">
                                <div className="section-title">Entries</div>
                                {results.posts.map(p=> (
                                    <button key={p.id} className="search-item" onClick={()=>goToPost(p.id)}>
                                        <div className="item-title">{p.title}</div>
                                        <div className="item-meta">{(p.author||'').slice(0,24)} · {p.tags && p.tags.length ? p.tags.slice(0,3).map(t=>`#${t}`).join(' ') : ''}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="nav-right">
                <Link to='/new-post' className="new-post" aria-label="Create new entry">New Entry</Link>

                <Link to='/profile' className="avatar" aria-label='Your profile'>{initials}</Link>
            
            </div>
        </header>
    )
}

export default NavBar