import React, { useState, useEffect, useContext } from 'react';
import DataTable from 'react-data-table-component';
import userContext from '../../../userContext';
import { useSnackbar } from 'notistack';
import Button from 'react-bootstrap/Button';

const UserBookList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(false);
  const {user} = useContext(userContext);
  const { enqueueSnackbar } = useSnackbar();
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

  const handleReserveBook = async () => {
    const confirmed = window.confirm('Are you sure you want to reserve this book?');
    if (confirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify({bookId}),
        });
        if (response.ok) {
          //setOrderStatus(response.data);
          enqueueSnackbar('Reserved successfully!', {variant: 'success'});
          setReservationStatus('reserved');
          setButtonDisabled(true);
          fetchData();
        } else {
          const errorMessage = await response.json();
          console.error(errorMessage);
          setOrderStatus('Error creating order. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setOrderStatus('Error creating order. Please try again.');
      }
    } else {}
  };

  // const handleReserveBook = async (_id) => {
  //   if (window.confirm('Are you sure you want to reserve this book?')) {
  //     try {
  //       const data = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${user.accessToken}`
  //         },
  //         body: JSON.stringify({ bookId: _id }),
  //       });
  //       const response = await data.json()
  //       if (response !== null) {
  //         alert(response.message)
  //       } else {
  //         alert(response.error)
  //       }
  //       // if (response.ok) {
  //       //   await response.json()
  //       //   alert('Reserved successfully!');
  //       //   //setReservedBooks(prevReservedBooks => [...prevReservedBooks, _id]);
  //       //   setReservationStatus(true);
  //       //   fetchData();
  //       // } else {
  //       //   const errorMessage = await response.json();
  //       //   console.error(errorMessage);
  //       // }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const columns = [
    {
      name: 'Ref ID',
      selector: (row) => row.bookRefID,
      sortable: true,
      wrap: true,
      hide: 'sm',
      width: '120px'
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      width: '25%'
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
          <Button 
            size='sm' variant="outline-primary" onClick={handleReserveBook}
            disabled={reservationStatus}>
              Reserve
          </Button>
        </div>
      ),
    },
  ];

  const customStyles={
    rows: {
      style: {
          minHeight: '40px'
      },
    },
    headCells:{
      style:{
        fontWeight:'bold',
        fontSize:'14px',
        wrap: true
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

export default UserBookList;
