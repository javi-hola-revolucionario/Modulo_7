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

    const user = users.find(
        u => u.id === parseInt(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }
    res.json(user);
});

app.get("/search", (req, res) => {
    console.log(req.query);
    res.json(req.query);
});

app.put("/users/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

});
    
app.listen(3000, () => {
    console.log("Servidor iniciado");
});