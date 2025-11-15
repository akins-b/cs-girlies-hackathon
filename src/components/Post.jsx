import React from "react"
import './Post.css'

function Post({ post }){
    const { author, title, content, tags, likes, comments, time } = post

    return (
        <article className="post-card">
            <header className="post-card-header">
                <div className="post-author">{ author }</div>
                <div className="post-meta">{ time }</div>
            </header>

            <h3 className="post-title">{ title }</h3>
            <p className="post-content">{ content }</p>

            <div className="post-tags">
                { tags.map((t) => (
                    <span key={t} className="post-tag">#{t}</span>
                ))}
            </div>

            <footer className="post-card-footer">
                <div className="post-actions">
                    <button className="action">👍 {likes}</button>
                    <button className="action">💬 {comments}</button>
                </div>
            </footer>
        </article>
    )
}

export default Post