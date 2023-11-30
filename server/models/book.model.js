import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
    bookRefID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    author: {
        type: Array,
        required: true
    },
    genre: {
        type: Array,
        required: true
    },
    language: {
        type: Array,
        required: true
    },
    shelfLocation: {
        type: String,
        required: true
    }
})

const Book = model('Book', bookSchema);
export default Book;