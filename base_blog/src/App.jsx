import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase'
import { fetchPosts, createPost, updatePost, deletePost } from './api/postsApi'
import './App.css'

const fallbackPosts = [
  {
    id: 'demo-1',
    title: 'Marvel Rivals: la nueva arena de combate',
    content: 'La comunidad sigue creciendo con nuevas estrategias, héroes y momentos épicos en cada partida.'
  },
  {
    id: 'demo-2',
    title: 'Tácticas clave para dominar el meta',
    content: 'Conocer la sinergia entre personajes y mapear cada enfrentamiento puede cambiar el resultado de una batalla.'
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
      <header className="hero-panel">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Marvel Rivals Hub</p>
            <h1>Tu comunidad para noticias, análisis y estrategias</h1>
            <p className="hero-text">
              Descubre las últimas novedades de Marvel Rivals, aprende desde los mejores jugadores y comparte tus ideas con la comunidad.
            </p>
          </div>
          <div className="hero-visuals">
            <img
              src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"
              alt="Marvel-inspired hero artwork"
              className="hero-image hero-image-left"
            />
            <img
              src="https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80"
              alt="Marvel-inspired hero artwork"
              className="hero-image hero-image-right"
            />
          </div>
        </div>
      </header>

      <form className="blog-form" onSubmit={handleSubmit}>
        <h2>Publica un nuevo análisis</h2>
        <input
          type="text"
          placeholder="Título del contenido"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Comparte tu opinión, estrategia o noticia..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Publicando...' : 'Publicar entrada'}
        </button>
      </form>

      {error && <p className="status-message error">{error}</p>}
      {successMessage && <p className="status-message success">{successMessage}</p>}

      <section className="posts-section">
        <div className="section-title">
          <h3>Últimas entradas</h3>
          <span>Actualizado para la comunidad</span>
        </div>
        <div className="posts-list">
          {posts.map((post, index) => (
            <article className="post-card" key={post.id}>
              <img
                src={index % 2 === 0
                  ? 'https://images.unsplash.com/photo-1518516343727-3f6d6c9f5cf3?auto=format&fit=crop&w=1000&q=80'
                  : 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1000&q=80'}
                alt={post.title}
                className="post-image"
              />
              <div className="post-content">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>Editar</button>
                  <button className="secondary" onClick={() => handleDelete(post.id)}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}