const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// Middleware para obtener un libro por ID (GET, POST, PUT, PATCH, DELETE)
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        book = await Book.findById(id);
        if(!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.book = book;
    next();
}

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALLs', books);
        if (books.length === 0) return res.status(204).json({ message: 'No hay libros en la base de datos' });
        return res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un libro por ID
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
});

// Crear un nuevo libro (recurso)
router.post('/', async (req, res) => {
    const { title, author, genre, pages, original_languaje, publication_date } = req?.body
    if (!title || !author || !genre || !pages || !original_languaje || !publication_date)
        return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const book = new Book({
        title,
        author,
        genre,
        pages,
        original_languaje,
        publication_date
    });

    try {
        const newBook = await book.save();
        console.log('POST', newBook);
        return res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un libro por ID
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.pages = req.body.pages || book.pages;
        book.original_languaje = req.body.original_languaje || book.original_languaje;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Actualizar un libro [PATCH]
router.patch('/:id', getBook, async (req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.pages &&!req.body.original_languaje && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
        })
    }

    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.pages = req.body.pages || book.pages;
        book.original_languaje = req.body.original_languaje || book.original_languaje;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Eliminar un libro [DELETE]
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports =router;