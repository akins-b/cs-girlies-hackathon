import Post from '../components/Post'

function Feed({ posts = [] }) {
    // if no posts provided, render a small placeholder
    if (!posts || posts.length === 0) {
        return (
            <main>
                <p style={{ color: '#9fb4c8' }}>No entries yet — create the first one.</p>
            </main>
        )
    }

    return (
        <main>
            {posts.map((p) => (
                <Post key={p.id} post={p} />
            ))}
        </main>
    )
}

export default Feed