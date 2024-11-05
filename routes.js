
const express = require('express');
const Livro = require('./models');
const router = express.Router();

// Cadastro de livros
router.post('/livros', async (req, res) => {
    try {
        const { titulo, autor, editora, anoPublicacao, numeroPaginas } = req.body;

        // Verificação se todos os campos foram preenchidos
        if (!titulo || !autor || !editora || !anoPublicacao || !numeroPaginas) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const duplicado = await Livro.findOne({ titulo: titulo })

        if (duplicado) {
            return res.status(409).json({ erro: 'O título do livro já foi cadastrado.' })
        }


        const livro = new Livro({ titulo, autor, editora, anoPublicacao, numeroPaginas });
        await livro.save();
        res.status(201).json(livro);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar livro' });
    }
});

// Listagem de livros
router.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar livros' });
    }
});

// Consulta de livro por ID
router.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json(livro);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livro' });
    }
});

// Remoção de livro
router.delete('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByIdAndDelete(req.params.id);

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json({ message: 'Livro removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar livro' });
    }
});

// Endpoint para atualização de livro pelo ID
router.put('/livros/:id', async (req, res) => {
    try {
        console.log("ID:", req.params.id);
        console.log("Body:", req.body);

        const { titulo, autor, editora, anoPublicacao, numeroPaginas } = req.body;

        // Verificação se todos os campos foram preenchidos
        if (!titulo || !autor || !editora || !anoPublicacao || !numeroPaginas) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Atualização do livro pelo ID
        const livroAtualizado = await Livro.findByIdAndUpdate(
            req.params.id,
            { titulo, autor, editora, anoPublicacao, numeroPaginas },
            { new: true } // retorna o documento atualizado
        );

        if (!livroAtualizado) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json({
            message: 'Livro atualizado com sucesso!',
            livro: livroAtualizado
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o livro' });
    }
});


module.exports = router;
