const express = require('express');
const app = express();
const PORT = 3000;

//lista
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.get('/posts', (req, res) => {
  const posts = [
    { id: 1, title: 'Primer post', content: 'Hola mundo' },
    { id: 2, title: 'Segundo post', content: 'Aprendiendo Express' },
  ];
  res.json(posts);
});

//creamos nuevo post
app.use(express.json());

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: Date.now(), title, content };
  res.status(201).json(newPost);
});


app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});