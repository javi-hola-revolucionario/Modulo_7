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
    console.log(req.body);   
    users.push(req.body);
    res.json({
        message: "Usuario guardado",
        data: req.body
    });
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(3000, () => {
    console.log("Servidor iniciado");
});