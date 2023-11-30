import { Router } from 'express';
import {
    getBooks,
    addBooks,
    searchBooks,
    getBooksWithLimit,
    editBook,
    deleteBook
} from '../controllers/book.controller.js';

const router = Router();

router.get('/', (request, response) => {
    if (request.query.limit !== undefined || request.query.offset !== undefined) {
        getBooksWithLimit(request, response)
    } else {
        getBooks(request, response)
    }
})
router.route('/').post(addBooks);
router.route('/search').get(searchBooks);
router.route('/:_id').put(editBook);
router.route('/:_id').delete(deleteBook);

export default router;