import Book from '../models/book.model.js';

const getBooks = async (request, response) => {
    try {
        const books = await Book.find();
        
        response.status(200).send({
            message: 'List of Books',
            data: books
        });
    } catch (error) {
        console.error(error);
        response.status(204).send({ message: 'Books not found '})
    }
};

const addBooks = async (request, response) => {
    try {
        const { bookRefID, title, publishYear, author, genre, language, shelfLocation } = request.body;
        const newBook = new Book({
            bookRefID,
            title,
            publishYear,
            author,
            genre,
            language,
            shelfLocation
        });

        await newBook.save();

        response.status(201).send({
            message: 'New Book Created',
            data: newBook
        });
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }

}

const searchBooks = async (request, response) => {
    try {
        const { bookRefID, title, publishYear, author, genre, language, shelfLocation } = request.query;

        const query = {};
        if (bookRefID) {
            query.bookRefID = { $in: [new RegExp(bookRefID, 'i')] };
        }
        if (title) {
            query.title = { $in: [new RegExp(title, 'i')] };
        }
        if (publishYear) {
            query.publishYear = { $in: [new RegExp(publishYear, 'i')] };
        }
        if (author) {
            query.author = { $in: [new RegExp(author, 'i')] };
        }
        if (genre) {
            query.genre = { $in: [new RegExp(genre, 'i')] };
        }
        if (language) {
            query.language = { $in: [new RegExp(language, 'i')] };
        }
        if (shelfLocation) {
            query.shelfLocation = { $in: [new RegExp(shelfLocation, 'i')]}
        }

        const matchBooks = await Book.find(query);

        if (matchBooks.length === 0) {
            response.status(404).send({ message: 'No books found' });
        } else {
            response.status(200).send({
                message: 'Books Search Result:',
                data: matchBooks
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
};


const getBooksWithLimit = async (request, response) => {
    try {
        const { limit, offset } = request.query;

        const limitValue = parseInt(limit);
        const offsetValue = parseInt(offset);

        const books = await Book.find({})
        .skip(offsetValue)
        .limit(limitValue)
        .exec();

        if (books.length > 0) {
            response.status(200).send({
                message: 'Books with limit and offset',
                data: books
            });
        } else {
           response.status(404).send({ message: 'Books not found' })
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Error fetching books' })
    }
}

const editBook = async (request, response) => {
    try {
        const { _id } = request.params;
        const { bookRefID, title, publishYear, author, genre, language, shelfLocation } = request.body;

        const book = await Book.findById(_id);

        if (book) {
            const updateObject = {};
            if (bookRefID !== undefined) updateObject.bookRefID = bookRefID;
            if (title !== undefined) updateObject.title = title;
            if (publishYear !== undefined) updateObject.publishYear = publishYear;
            if (author !== undefined) updateObject.author = author;
            if (genre !== undefined) updateObject.genre = genre;
            if (language !== undefined) updateObject.language = language;
            if (shelfLocation !== undefined) updateObject.shelfLocation = shelfLocation;

            await Book.updateOne({ _id }, { $set: updateObject });

            response.status(200).send({
                message: 'Book has been updated',
                success: true
            });
        } else {
            response.status(404).send({
                message: `Book with ID ${_id} not found`
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
};

const deleteBook = async (request, response) => {
    try {
        const { _id } = request.params;

        const book = await Book.deleteOne( { _id });

        if (!book) {
            response.status(404).send({
                message: `Book with ID ${_id} not found`
            }) 
        } else {
            response.status(200).send({
                message: 'Book item has been deleted'
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
};

export {
    getBooks,
    addBooks,
    searchBooks,
    getBooksWithLimit,
    editBook,
    deleteBook
}; 