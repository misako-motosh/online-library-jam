import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';


const AdminUserList = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] =  useState([]);

 
  useEffect(() => { 
    fetchData();
  },[]);

  useEffect(() => {
    const result = entries.filter((entry) => {
      return entry.firstName.toString().toLowerCase().match(search.toString().toLowerCase());
    });
    setFilter(result);
    console.log(typeof search);
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
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`,{
        method: 'PUT'
      })
      .then((res) => res.json())
      .then(() => fetchData())
    }
  };

  const columns = [
    // {
    //   name: 'No.',
    //   selector: (row) => row.no,
    //   sortable: true,
    // },
    {
      name: 'University ID',
      selector: (row) => row.universityID,
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'User Role',
      selector: (row) => row. userRole,
      sortable: true,
    },
    {
      name: 'Actions',
      button: true,
      cell: (row) => (
        <button variant="success" onClick={() => {
          handleClick(row.action)
          }}>Change Role</button>
      ),
    },
  
  ];

  const tableData = entries.map((entry) => {
    return {
      universityID:entry.universityID,
      firstName:entry.firstName,
      lastName:entry.lastName,
      email:entry.email,
      userRole:entry.userRole,
      action:entry._id
    }
  })

  return (
    <div>
      <h3>List of Registered Users</h3>
      <DataTable 
        columns={columns} 
        data={tableData} 
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
  )
}

export default AdminUserList