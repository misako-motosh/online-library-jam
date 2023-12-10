import { useState, useEffect, useContext } from 'react';
import DataTable from 'react-data-table-component';
import userContext from '../../../userContext';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Button from 'react-bootstrap/Button';

const UserBookList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [reservationStatus, setReservationStatus] = useState(false);
  const {user} = useContext(userContext);
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [pending, setPending] = useState(true);

  useEffect(() => { 
    const timeout =setTimeout(() => {
      setPending(false);
      fetchData();
    }, 2000);
    return () => clearTimeout(timeout);
  },[]);

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
    const confirmed = window.confirm('Are you sure you want to reserve this book?');   
    if (confirmed) {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify({
            userId: localStorage.getItem('UserId'),
            bookId: _id
          })
        });

        const response = await data.json()

        if (response.message ==='Maximum of 5 orders have been reached. Ensure some of the books have been returned to create another order.') {
          enqueueSnackbar(response.message, {variant: 'warning'});
        } else if (response.message ==='Order created! Be sure to pick up the book within 1 day.') {
          enqueueSnackbar(response.message, {variant: 'success'});
        } else if (response.message ==='Book has already been reserved or borrowed. Try again later.') {
          enqueueSnackbar(response.message, {variant: 'warning'});
        } else {
          enqueueSnackbar(response.error, {variant: 'error'});
        }
      } catch(error) {
        enqueueSnackbar('Error', {variant: 'error'});
        console.error('Error during fetch:', error);
      }
   }
  };

  const columns = [
    {
      name: 'Ref ID',
      selector: (row) => row.bookRefID,
      sortable: true,
      wrap: true,
      hide: 'sm',
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: ' Publish Year',
      selector: (row) => row.publishYear,
      sortable: true,
      wrap: true,
      hide: 'sm',
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
    },
    {
      name: 'Language',
      selector: (row) => row.language,
      sortable: true,
      wrap: true,
      hide: 'md',
    },
    {
      name: 'Shelf Location',
      selector: (row) => row.shelfLocation,
      sortable: true,
      wrap: true,
      hide: 'md',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Button 
            size='sm' variant="outline-primary"
            onClick={() => {
              handleReserveBook(row._id)}}
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
          minHeight: '40px', // override the row height
      },
    },
    headCells:{
      style:{
        fontWeight:'bold',
        fontSize:'14px',
        wrap: true,
        // backgroundColor:'blue',
      },
    },
    cells: {
      style: {
          paddingLeft: '8px', // override the cell padding for data cells
          paddingRight: '8px',
      },
    },
  }

  return (
    <div>
      <DataTable 
        title='User Book Lists'
        customStyles={ customStyles }
        progressPending={pending}
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
