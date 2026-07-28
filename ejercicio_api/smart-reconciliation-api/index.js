const express = require('express');
const app = express();
app.use(express.json());
const users = [];


app.get("/", (req, res) => {
    res.json({
        message: "API funcionando"
    });
});

app.post("/users", (req, res) => {

    const newUser = {
    id: users.length + 1,
    ...req.body
};

    users.push(newUser);

    res.json({
        message: "Usuario guardado",
        data: newUser
    });
});

app.get("/users/:id", (req, res) => {
    
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    console.log(req.params);
    console.log(req.params.id);
    
    res.json(users);
});

app.listen(3000, () => {
    console.log("Servidor iniciado");
});