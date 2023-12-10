import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/addBookFormStyle.css'
import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar('New Book has been added to the library', {variant: 'success'});
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
    <div className="wholeForm-BookForm">
      <h3>Add Book Entry Form</h3>
      <form className="form-BookForm" onSubmit={handleCreateNewBook}>
        <label className="label-BookForm">Book Reference ID</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='bookRefID'
          placeholder='type here...'
          value={addBook.bookRefID}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Title</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='title'
          placeholder='type here...'
          value={addBook.title}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Publish Year</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='publishYear'
          placeholder='type here...'
          value={addBook.publishYear}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Author</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='author'
          placeholder='type here...'
          value={addBook.author}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Genre</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='genre'
          placeholder='type here...'
          value={addBook.genre}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Language</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='language'
          placeholder='type here...'
          value={addBook.language}
          onChange={handleChange}
        />
        <br />
        <label className="label-BookForm">Shelf Location</label>
        <br />
        <input 
          className="input-BookForm"
          type='text'
          name='shelfLocation'
          placeholder='type here...'
          value={addBook.shelfLocation}
          onChange={handleChange}
        />
        <br />
        {error && <p className="p-BookForm" style={{ color: 'red' }}>{error}</p>}
        <br />
        <button className="btn-BookForm green" type="submit">Create New Book</button>
      </form>
    </div>

  )
}

export default AddBookEntryForm
