import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css';

function NavBar() {
    return (
        <header className="nav">
            <div className="nav-left">
                <Link to='/' className="brand">LearnSpace</Link>
                <nav className="nav-links">
                    <Link to='/home'>Home</Link>
                    <Link to="/explore-topics">Explore</Link>
                </nav>
            </div>

            <div className="nav-center">
                <label htmlFor="nav-search-input" className="visually-hidden">Search</label>
                <input id='nav-search-input' className="nav-search" placeholder="Search topics, posts..." aria-label="Search" />
            </div>
            
            <div className="nav-right">
                <Link to='/new-post' className="new-post" aria-label="Create new post">New Post</Link>

                <Link to='/profile' className="avatar" aria-label='Your profile'>JS</Link>
                
            </div>
        </header>
    )
}

export default NavBar