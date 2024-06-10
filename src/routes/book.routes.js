const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json(
                {
                    message: 'El libro no fue encontrado'
                }
            )
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    res.book = book;
    next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// Obtener un libro por ID [GET BY ID]
router.get('/:id', getBook, (req, res) => {
    res.json(res.book)
})

// Crear un libro [CREATE]
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        pages: req.body.pages,
        original_language: req.body.original_language,
        publication_date: req.body.publication_date
    })
    try {
        const newBook = await book.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
)

// Actualizar un libro [UPDATE]
router.patch('/:id', getBook, async (req, res) => {
    if (req.body.title != null) {
        res.book.title = req.body.title
    }
    if (req.body.author != null) {
        res.book.author = req.body.author
    }
    if (req.body.genre != null) {
        res.book.genre = req.body.genre
    }
    if (req.body.pages != null) {
        res.book.pages = req.body.pages
    }
    if (req.body.original_language != null) {
        res.book.original_language = req.body.original_language
    }
    if (req.body.publication_date != null) {
        res.book.publication_date = req.body.publication_date
    }
    try {
        const updatedBook = await res.book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Eliminar un libro [DELETE]
router.delete('/:id', getBook, async (req, res) => {
    try {
        await res.book.delete()
        res.json({ message: 'Libro eliminado' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Actualizar un libro [PUT]
router.put('/:id', getBook, async (req, res) => {
    try {
        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
)


module.exports = router