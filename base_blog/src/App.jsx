import { useState, useEffect, useCallback } from 'react'
import { supabase } from './utils/supabase'
import { fetchPosts, createPost, updatePost, deletePost } from './api/postsApi'
import './App.css'

const fallbackPosts = [
  {
    id: 'demo-1',
    title: 'El poder de los libros que nos cambian',
    content: 'Cada lectura deja una huella distinta. Hoy compartimos historias que nos hicieron pensar, soñar y volver a empezar.'
  },
  {
    id: 'demo-2',
    title: 'Recomendaciones para una tarde de lectura',
    content: 'Algunos libros te acompañan toda la vida. Aquí van los que más han marcado a nuestra comunidad.'
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
            <p className="eyebrow">Book Community</p>
            <h1>Comparte tus libros favoritos con el mundo</h1>
            <p className="hero-text">
              Una plataforma para descubrir nuevas lecturas, guardar tus favoritos y conversar con otros amantes de los libros.
            </p>
          </div>
          <div className="hero-visuals">
            <img
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80"
              alt="Books and reading corner"
              className="hero-image hero-image-left"
            />
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"
              alt="A cozy book collection"
              className="hero-image hero-image-right"
            />
          </div>
        </div>
      </header>

      <form className="blog-form" onSubmit={handleSubmit}>
        <h2>Comparte tu recomendación</h2>
        <input
          type="text"
          placeholder="Título del libro o reseña"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Escribe por qué lo recomendaste..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Publicando...' : 'Compartir recomendación'}
        </button>
      </form>

      {error && <p className="status-message error">{error}</p>}
      {successMessage && <p className="status-message success">{successMessage}</p>}

      <section className="posts-section">
        <div className="section-title">
          <h3>Últimas recomendaciones</h3>
          <span>Lo que hoy está enamorando a los lectores</span>
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