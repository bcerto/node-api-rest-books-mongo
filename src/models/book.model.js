const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    original_languaje: {
        type: String,
        required: true,
    },
    publication_date: {
        type: String,
        default: Date.now,
    }
});

module.exports = mongoose.model('Book', bookSchema);
