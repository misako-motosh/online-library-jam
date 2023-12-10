import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { BsPencilSquare } from 'react-icons/bs';
import { BsTrash3 } from 'react-icons/bs';

const AdminBookList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
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
          enqueueSnackbar('Book deleted successfully!', {variant: 'success'});
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
      name: 'Ref ID',
      selector: (row) => row.bookRefID,
      sortable: true,
      wrap: true,
      width: '100px'
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      width: '23%',
    },
    {
      name: ' Publish Year',
      selector: (row) => row.publishYear,
      sortable: true,
      wrap: true,
      hide: 'sm'
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
      wrap: true,
      hide: 'sm',
      width: '280px'
    },
    {
      name: 'Genre',
      selector: (row) => row.genre,
      sortable: true,
      wrap: true,
      hide: 'md',
      width: '120px'

    },
    {
      name: 'Language',
      selector: (row) => row.language,
      sortable: true,
      wrap: true,
      hide: 'md',
      width: '120px'
    },
    {
      name: 'Shelf Location',
      selector: (row) => row.shelfLocation,
      sortable: true,
      wrap: true,
      hide: 'sm',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <BsPencilSquare 
            size={20} 
            color="blue" 
            style={{
              marginRight: '10px',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => handleEditBookBtn(row._id)}>Edit
          </BsPencilSquare>
          <BsTrash3 
            size={20} 
            color="red"
            style={{transition: 'transform 0.3s',}}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} 
            onClick={() => handleDeleteBookBtn(row._id)}>Delete
          </BsTrash3>
        </div>
      ),
      wrap: true,
    },
  ];

  const customStyles={
    rows: {
      style: {
          minHeight: '40px',
      },
    },
    headCells:{
      style:{
        fontWeight:'bold',
        fontSize:'14px',
        wrap: true,
      },
    },
    cells: {
      style: {
          paddingLeft: '8px',
          paddingRight: '8px',
      },
    },
  }

  return (
    <div>
      <DataTable 
        title='Admin Booklists'
        customStyles={ customStyles }
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
              className='w-100 form-control'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
            subHeaderAlign="right"
        />
    </div>
  );
};

export default AdminBookList;
