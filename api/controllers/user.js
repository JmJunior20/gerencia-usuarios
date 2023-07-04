import { db } from "../db.js";

export const getUsers = (_, res) => {
    const q = "SELECT * FROM usuarios WHERE `ativo` = 1";

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const addUser = (req, res) => {
    const checkQuery = "SELECT * FROM usuarios WHERE nome = ? AND email = ?";
    const values = [
        req.body.nome,
        req.body.email
    ];

    const insertQuery = "INSERT INTO usuarios (nome, email, senha, nome_usuario, ativo) VALUES (?, ?, ?, ?, ?)";
    const insertValues = [
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.body.nome_usuario,
        1 // Define o novo registro como ativo (ativo = 1)
    ];

    db.query(insertQuery, insertValues, (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Usuário criado com sucesso.");
    });
};



export const updateUser = (req, res) => {
    const q = "UPDATE usuarios SET `nome` = ?, `email` = ?, `senha` = ?, `nome_usuario` = ? WHERE `id` = ?";

    const values = [
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.body.nome_usuario,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Usuário atualizado com sucesso.");
    });
};

export const deleteUser = (req, res) => {
    const q = "UPDATE usuarios SET ativo = ? WHERE Id = ?";

    db.query(q, [0, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Usuário inativado com sucesso.");
    });
};