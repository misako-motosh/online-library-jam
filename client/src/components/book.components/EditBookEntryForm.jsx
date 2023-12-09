import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditBookEntryForm = ({}) => {
  const {id} = useParams();
  const [editBook, setEditBook] = useState({
    _id: id,
    bookRefID: '',
    title: '',
    publishYear: '',
    author: [],
    genre: [],
    language: [],
    shelfLocation: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/books/${id}`)
    .then(response => {
      console.log(response)
      const { bookRefID, title, publishYear, author, genre, language, shelfLocation } = response.data
      setEditBook({
        ...editBook,
        bookRefID,
        title,
        publishYear,
        author,
        genre,
        language,
        shelfLocation,
      });
      setEditBook(response.data);
    })
    .catch(error => console.log(error))
  }, [id])

  const handleUpdateBookBtn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/books/${id}`, editBook);
      if (response.status === 200) {
        alert('Book details updated successfully!')
        navigate('/admin');
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  }

  const handleCancelEditButton = async () => {
    navigate('/admin');
  }

  return (
    <div>
      <h2>EditBookEntryForm</h2>
      <form onSubmit={handleUpdateBookBtn}>
        <label>Book Reference ID</label>
        <br />
        <input 
          type='text'
          value={editBook.bookRefID}
          onChange={(e) => setEditBook({...editBook, bookRefID: e.target.value})}
        />
        <br />
        <label>Title</label>
        <br />
        <input 
          type='text'
          value={editBook.title}
          onChange={(e) => setEditBook({...editBook, title: e.target.value})}
        />
        <br />
        <label>Publish Year</label>
        <br />
        <input 
          type='text'
          value={editBook.publishYear}
          onChange={(e) => setEditBook({...editBook, publishYear: e.target.value})}
        />
        <br />
        <label>Author</label>
        <br />
        <input 
          type='text'
          value={editBook.author}
          onChange={(e) => setEditBook({...editBook, author: e.target.value.split(',')})}
        />
        <br />
        <label>Genre</label>
        <br />
        <input 
          type='text'
          value={editBook.genre}
          onChange={(e) => setEditBook({...editBook, genre: e.target.value.split(',')})}
        />
        <br />
        <label>Language</label>
        <br />
        <input 
          type='text'
          value={editBook.language}
          onChange={(e) => setEditBook({...editBook, language: e.target.value.split(',')})}
        />
        <br />
        <label>Shelf Location</label>
        <br />
        <input 
          type='text'
          value={editBook.shelfLocation}
          onChange={(e) => setEditBook({...editBook, shelfLocation: e.target.value})}
        />
        <br />
        <button type="button" onClick={handleUpdateBookBtn}>Update</button>
        <button type="button" onClick={handleCancelEditButton}>Cancel</button>
      </form>
    </div>
  )
}

export default EditBookEntryForm