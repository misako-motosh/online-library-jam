import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSnackbar } from 'notistack';
import Button from 'react-bootstrap/Button';

const AdminUserList = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] =  useState([]);
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
    const result = entries.filter((entry) => {
      if (entry.firstName.toString().toLowerCase().match(search.toString().toLowerCase())) {
        return entry.firstName.toString().toLowerCase().match(search.toString().toLowerCase())
      } else if (entry.lastName.toString().toLowerCase().match(search.toString().toLowerCase())) {
        return  entry.lastName.toString().toLowerCase().match(search.toString().toLowerCase())
      } else if (entry.universityID.toString().toLowerCase().match(search.toString().toLowerCase())) {
        return entry.universityID.toString().toLowerCase().match(search.toString().toLowerCase())
      } else if (entry.email.toString().toLowerCase().match(search.toString().toLowerCase())) {
        return entry.email.toString().toLowerCase().match(search.toString().toLowerCase())
      } else {
        return entry.userRole.toString().toLowerCase().match(search.toString().toLowerCase())
      }
    });
    setFilter(result);
  },[search]);

  const fetchData = async () => {
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`);
      const response = await result.json();
      setEntries(response.data); 
      setFilter(response.data);
    } catch(error) {
      console.log(error);
    }
  };
 
  const handleClick = async (id) => {
    if (window.confirm('Are you sure you want to change the role?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`, {
          method: 'PUT'
        });
  
        if (response.ok) {
          await response.json();
          enqueueSnackbar('Successful Role change', {variant: 'success'});
          fetchData();
        } else {
          // Handle error if needed
          enqueueSnackbar('Error', {variant: 'error'});
          console.error('Failed to update role');
        }
      } catch (error) {
        // Handle fetch error
        enqueueSnackbar('Error', {variant: 'error'});
        console.error('Error during fetch:', error);
      }
    }
  };

  const columns = [
    {
      name: 'University ID',
      selector: (row) => row.universityID,
      sortable: true,
      wrap: true,
      hide: 'sm',


    },
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      sortable: true,
      wrap: true,
      hide: 'sm',
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      sortable: true,
      wrap: true,
      hide: 'md',
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'User Role',
      selector: (row) => row. userRole,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      button: true,
      cell: (row) => (
        <Button size='sm' variant="outline-primary" onClick={() => {
          handleClick(row._id)
          }}>Change Role</Button>
      ),
      wrap: true,
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
        title='List of Registered Users'
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
  )
}

export default AdminUserList