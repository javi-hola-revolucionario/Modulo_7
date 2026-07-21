import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase'
import { fetchPosts, createPost, updatePost, deletePost } from './api/postsApi'

const fallbackPosts = [
  {
    id: 'demo-1',
    title: 'Welcome to your blog',
    content: 'Your posts will appear here once Supabase is connected.'
  }
]

export default function App() {
  const [posts, setPosts] = useState(fallbackPosts)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)

  const fetchPostsData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPosts()
      setPosts(data.length ? data : fallbackPosts)
    } catch (error) {
      setError(error.message)
      setPosts(fallbackPosts)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchPostsData()
  }, [fetchPostsData]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    const postData = { title, content }

    try {
      if (editingPostId) {
        await updatePost(editingPostId, postData)
        setSuccessMessage('Post updated successfully')
      } else {
        await createPost(postData)
        setSuccessMessage('Post created successfully')
      }
      setTitle('')
      setContent('')
      setEditingPostId(null)
      fetchPostsData()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post) => {
    setTitle(post.title)
    setContent(post.content)
    setEditingPostId(post.id)
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await deletePost(postId)
      setSuccessMessage('Post deleted successfully')
      fetchPostsData()
    } catch (error) {
      setError(error.message)
    }
  } 

  return (
    <div className="App">
      <h1>My Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}