import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const UserBookList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(false);
  //const [reservedBooks, setReservedBooks] = useState([]);

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

  const handleReserveBook = async (_id) => {
    if (window.confirm('Are you sure you want to reserve this book?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: _id }),
        });
        if (response.ok) {
          await response.json()
          alert('Reserved successfully!');
          //setReservedBooks(prevReservedBooks => [...prevReservedBooks, _id]);
          setReservationStatus(true);
          fetchData();
        } else {
          const errorMessage = await response.json();
          console.error(errorMessage);
        }
      } catch (error) {
        console.error(error);
      }
    } else {}
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
          <button 
            onClick={handleReserveBook}
            disabled={reservationStatus}>
              Reserve
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3>User Book Lists</h3>
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

export default UserBookList;
