import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const AdminUserList = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = entries.filter((entry) => {
      if (
        entry.firstName
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return entry.firstName
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        entry.lastName
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return entry.lastName
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        entry.universityID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return entry.universityID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else {
        return entry.userRole
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      }
    });
    setFilter(result);
  }, [search]);

  const fetchData = async () => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users`
      );
      const response = await result.json();
      setEntries(response.data);
      setFilter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (id) => {
    if (window.confirm("Are you sure you want to change the role?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/${id}`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          await response.json();
          fetchData();
        } else {
          // Handle error if needed
          console.error("Failed to update role");
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error during fetch:", error);
      }
    }
  };

  const columns = [
    {
      name: "University ID",
      selector: (row) => row.universityID,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "User Role",
      selector: (row) => row.userRole,
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <button
          onClick={() => {
            handleClick(row._id);
          }}
        >
          Change Role
        </button>
      ),
    },
  ];

  return (
    <div>
      <h3>List of Registered Users</h3>
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
            type="text"
            className="w-25 form-control"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
    </div>
  );
};

export default AdminUserList;
