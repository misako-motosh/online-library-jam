import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditBookEntryForm = () => {
  const { _id } = useParams();
  const [book, setBook] = useState({
    bookRefID: '',
    title: '',
    publishYear: '',
    author: [],
    genre: [],
    language: [],
    shelfLocation: ''
  })

  useEffect(() => {
    
  })
  return (
    <div>EditBookEntryForm</div>
  )
}

export default EditBookEntryForm