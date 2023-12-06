import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EditBookEntryForm = () => {
  const {_id} = useParams();
  const [book, setBook] = useState({
    bookRefID: '',
    title: '',
    publishYear: '',
    author: [],
    genre: [],
    language: [],
    shelfLocation: ''
  });
  const navigate = useNavigate();

  const handleUpdateBookBtn = async (_id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/books/${_id}`, book);
      if (response.ok) {
        await response.json();
        alert('Book updated successfully!')
        navigate('/admin');
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleCancelEditButton = async () => {
    navigate('/admin');
  }

  return (
    <div>
      <h2>EditBookEntryForm</h2>
      <form>
        <label>Book Reference ID</label>
        <br />
        <input 
          type='text'
          value={book.bookRefID}
          onChange={(e) => setBook({...book, bookRefID: e.target.value})}
        />
        <br />
        <label>Title</label>
        <br />
        <input 
          type='text'
          value={book.title}
          onChange={(e) => setBook({...book, title: e.target.value})}
        />
        <br />
        <label>Publish Year</label>
        <br />
        <input 
          type='text'
          value={book.publishYear}
          onChange={(e) => setBook({...book, publishYear: e.target.value})}
        />
        <br />
        <label>Author</label>
        <br />
        <input 
          type='text'
          value={book.author}
          onChange={(e) => setBook({...book, author: e.target.value})}
        />
        <br />
        <label>Genre</label>
        <br />
        <input 
          type='text'
          value={book.genre}
          onChange={(e) => setBook({...book, genre: e.target.value})}
        />
        <br />
        <label>Language</label>
        <br />
        <input 
          type='text'
          value={book.language}
          onChange={(e) => setBook({...book, language: e.target.value})}
        />
        <br />
        <label>Shelf Location</label>
        <br />
        <input 
          type='text'
          value={book.shelfLocation}
          onChange={(e) => setBook({...book, shelfLocation: e.target.value})}
        />
        <br />
        <button type="button" onClick={handleUpdateBookBtn}>Update</button>
        <button type="button" onClick={handleCancelEditButton}>Cancel</button>
      </form>
    </div>
  )
}

export default EditBookEntryForm