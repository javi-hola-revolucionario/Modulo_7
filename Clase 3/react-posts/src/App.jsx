import { useEffect,useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedPost, setSelectedPost] =

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      setPosts(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Ocurrio un error");
      setLoading(false);
    });

  }, []);

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  

  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}

export default App
