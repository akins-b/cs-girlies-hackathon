import React, { useState, useMemo } from 'react'
import './ProfileTabs.css'

export default function ProfileTabs({ posts = [], savedPosts = [], showSaved = true }) {
  const [active, setActive] = useState('posts')
  const [query, setQuery] = useState('')

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => {
      const inTitle = p.title && p.title.toLowerCase().includes(q)
      const inContent = p.content && p.content.toLowerCase().includes(q)
      const inTags = p.tags && p.tags.join(' ').toLowerCase().includes(q)
      return inTitle || inContent || inTags
    })
  }, [posts, query])

  return (
    <section className="profile-tabs">
      <div className="tabs-nav">
          <button
            className={`tab ${active === 'posts' ? 'active' : ''}`}
            onClick={() => setActive('posts')}
          >
            My Entries
          </button>
        {/* Achievements tab removed per request */}
        {showSaved && (
          <button
            className={`tab ${active === 'saved' ? 'active' : ''}`}
            onClick={() => setActive('saved')}
          >
            Saved
          </button>
        )}
      </div>

      {/* Search input - filters current tab content (posts supported) */}
      <div className="tabs-search">
        <label htmlFor="profile-search" className="visually-hidden">Search</label>
        <input
          id="profile-search"
          className="profile-search"
          placeholder={active === 'posts' ? 'Search my entries...' : 'Search...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="tabs-panel">
        {active === 'posts' && (
          <div className="tab-content posts-list">
            {filteredPosts && filteredPosts.length ? (
              filteredPosts.map((p) => (
                <article key={p.id} className="mini-post">
                  <h4 className="mini-post-title">{p.title}</h4>
                  <p className="mini-post-excerpt">{p.content.slice(0, 120)}{p.content.length>120? '…':''}</p>
                </article>
              ))
            ) : (
              // If there are posts but none match the search, show a helpful message.
              // If there are no posts at all, tell the user no posts have been created yet.
              (posts && posts.length) ? (
                <p className="empty">No results. Try a different search.</p>
              ) : (
                <p className="empty">No entries have been created.</p>
              )
            )}
          </div>
        )}

        {/* Achievements content removed */}

        {showSaved && active === 'saved' && (
          <div className="tab-content saved">
            {savedPosts && savedPosts.length ? (
              savedPosts.map((p) => (
                <article key={p.id} className="mini-post">
                  <h4 className="mini-post-title">{p.title}</h4>
                  <p className="mini-post-excerpt">{p.content.slice(0, 120)}{p.content.length>120? '…':''}</p>
                </article>
              ))
            ) : (
              <p className="empty">No saved entries yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
