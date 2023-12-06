import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBookEntryForm = () => {
  const navigate = useNavigate();
  const [addBook, setAddBook] = useState({
    bookRefID: '',
    title: '',
    publishYear: '',
    author: '',
    genre: '',
    language: '',
    shelfLocation: '',
  });
  const [error, setError] = useState('');

  const handleCreateNewBook = async (e) => {
    e.preventDefault();

    const newBook = {
      bookRefID: addBook.bookRefID,
      title: addBook.title,
      publishYear: addBook.publishYear,
      author: addBook.author,
      genre: addBook.genre,
      language: addBook.language,
      shelfLocation: addBook.shelfLocation
    };

    try {
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/books`, newBook);
      alert('New Book has been added to the library');
      setError('');
      navigate('/admin');
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  const handleChange = (e) => {
    setAddBook({
      ...addBook,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <h3>Add Book Entry Form</h3>
      <form className="form-AddBookForm" onSubmit={handleCreateNewBook}>
        <label className="label-AddBookForm">Book Reference ID</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='bookRefID'
          value={addBook.bookRefID}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Title</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='title'
          value={addBook.title}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Publish Year</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='publishYear'
          value={addBook.publishYear}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Author</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='author'
          value={addBook.author}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Genre</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='genre'
          value={addBook.genre}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Language</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='language'
          value={addBook.language}
          onChange={handleChange}
        />
        <br />
        <label className="label-AddBookForm">Shelf Location</label>
        <br />
        <input 
          className="input-AddBookForm"
          type='text'
          name='shelfLocation'
          value={addBook.shelfLocation}
          onChange={handleChange}
        />
        <br />
        {error && <p className="p-AddBookForm" style={{ color: 'red' }}>{error}</p>}
        <br />
        <button className="btn-AddBookForm" type="submit">Create New Book</button>
      </form>
    </div>

  )
}

export default AddBookEntryForm
