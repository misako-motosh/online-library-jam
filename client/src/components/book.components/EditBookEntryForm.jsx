import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBookEntryForm = () => {
  const [bookRefID, setBookRefID] = useState('');
  const [title, setTitle] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [author, setAuthor] = useState([]);
  const [genre, setGenre] = useState([]);
  const [language, setLanguage] = useState([]);
  const [shelfLocation, setShelfLocation] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/books/${id}`)
    .then((response) => {
      console.log(response);
      setBookRefID(response.data.data.bookRefID);
      setTitle(response.data.data.title);
      setPublishYear(response.data.data.publishYear);
      setAuthor(response.data.data.author);
      setGenre(response.data.data.genre);
      setLanguage(response.data.data.language);
      setShelfLocation(response.data.data.shelfLocation)
    }).catch((error) => {
      console.log(error)
    });
  }, [])

  const handleUpdateBookBtn = async (e) => {
    const data = {
      bookRefID,
      title,
      publishYear,
      author,
      genre,
      language,
      shelfLocation
    };
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/books/${id}`, data);
      if (response.status === 200) {
        enqueueSnackbar('Book details updated successfully!', {variant: 'success'});
        navigate('/admin');
      }  else {
        enqueueSnackbar('Error', {variant: 'error'});
        console.error('Failed to update book');
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
          value={bookRefID}
          onChange={(e) => setBookRefID(e.target.value)}
        />
        <br />
        <label>Title</label>
        <br />
        <input 
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label>Publish Year</label>
        <br />
        <input 
          type='text'
          value={publishYear}
          onChange={(e) => setPublishYear(e.target.value)}
        />
        <br />
        <label>Author</label>
        <br />
        <input 
          type='text'
          value={author}
          onChange={(e) => setAuthor(e.target.value.split(','))}
        />
        <br />
        <label>Genre</label>
        <br />
        <input 
          type='text'
          value={genre}
          onChange={(e) => setGenre(e.target.value.split(','))}
        />
        <br />
        <label>Language</label>
        <br />
        <input 
          type='text'
          value={language}
          onChange={(e) => setLanguage(e.target.value.split(','))}
        />
        <br />
        <label>Shelf Location</label>
        <br />
        <input 
          type='text'
          value={shelfLocation}
          onChange={(e) => setShelfLocation(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleUpdateBookBtn}>Update</button>
        <button type="button" onClick={handleCancelEditButton}>Cancel</button>
      </form>
    </div>
  )
}

export default EditBookEntryForm