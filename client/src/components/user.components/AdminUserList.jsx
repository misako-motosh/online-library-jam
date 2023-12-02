import { useState, useEffect } from 'react';

const AdminUserList = () => {
  const [entries, setEntries] = useState([]);
  // const { user } = useContext(userContext);

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users`);
    const response = await result.json();
    setEntries(response.data); 
  };
 
  const updateToAdmin = async (id) => {
    if (window.confirm('Are you sure you want to change the role to Admin?')) {
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`,{
        method: 'PUT'
      })
      .then((res) => res.json())
      .then(
        fetchData()
      )
    }
  };

  return (
    <div>
      <div>
        <h1>List of Registered Users</h1>
      </div>
      <table>
      <thead>
        <tr>
          <th>University ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>User Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry._id}>
            <td>{entry.universityID}</td>
            <td>{entry.firstName}</td>
            <td>{entry.lastName}</td>
            <td>{entry.email}</td>
            <td>{entry.userRole}</td>
            <td>
              <button onClick={() => updateToAdmin(entry.Id)}>
                Change to Admin
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    
      </table>
    </div>
  )
}

export default AdminUserList