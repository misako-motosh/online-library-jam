import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

const AdminBookList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = data.filter((data) => {
      const propertiesToSearch = ['bookRefID', 'title', 'publishYear', 'author', 'genre', 'language', 'shelfLocation'];
      const lowercasedSearch = search.toLowerCase();

      return propertiesToSearch.some(property =>
       data[property].toString().toLowerCase().includes(lowercasedSearch)
      );
    });
    setFilter(result);
  },[search])

  const fetchData = async () => {
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/books`);
      const response = await result.json();
      setData(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBookBtn = async (_id) => {
    const confirmed = window.confirm('Are you sure you want to edit the book contents?');
    if (confirmed) {
      navigate(`/admin/editbook/${_id}`);
     } else {}
  };

  const handleDeleteBookBtn = async (_id) => {
    const confirmed = window.confirm('Are you sure you want to delete this book?')
    if (confirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/books/${_id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          alert('Book deleted successfully!');
          fetchData();
        } else {
          console.error('Error deleting book:', errorMessage);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const columns = [
    {
      name: 'Book Reference ID',
      selector: (row) => row.bookRefID,
      sortable: true,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Publish Year',
      selector: (row) => row.publishYear,
      sortable: true,
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
    },
    {
      name: 'Genre',
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: 'Language',
      selector: (row) => row.language,
      sortable: true,
    },
    {
      name: 'Shelf Location',
      selector: (row) => row.shelfLocation,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button onClick={() => handleEditBookBtn(row._id)}>Edit</button>
          <button onClick={() => handleDeleteBookBtn(row._id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3>Admin Book Lists</h3>
      <DataTable 
        columns={columns} 
        data={filter} 
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        fixedHeader
        pagination
        subHeader
          subHeaderComponent={
            <input 
              type='text'
              className='w-25 form-control'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
      />
  </div>
  );
};

export default AdminBookList;
