import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import humanizeDuration from "humanize-duration";
import { useSnackbar } from "notistack";
import Button from "react-bootstrap/Button";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";

const AdminReserveView = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
      fetchData();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const result = data.filter((data) => {
      if (
        data.bookId.bookRefID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return data.bookId.bookRefID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        data.bookId.title
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return data.bookId.title
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        data.bookId.shelfLocation
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return data.bookId.shelfLocation
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        data.userId.universityID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return data.userId.universityID
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase());
      } else if (
        data.userId.email
          .toString()
          .toLowerCase()
          .match(search.toString().toLowerCase())
      ) {
        return data.userId.email
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
        `${import.meta.env.VITE_API_URL}/api/v1/orders/reserved/all`
      );
      const response = await result.json();
      setData(response.data);
      console.log(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBorrow = async (id) => {
    if (
      window.confirm(
        `Order ID: ${id}. Make sure book is ready before confirming.`
      )
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/orders/${id}?proceed=true`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          await response.json();
          enqueueSnackbar(
            "Order has been successfully picked up by the borrower.",
            { variant: "success" }
          );
          fetchData();
        } else {
          // Handle error
          enqueueSnackbar("Error", { variant: "error" });
          console.error("Order completion failed!");
        }
      } catch (error) {
        enqueueSnackbar("Server Error", { variant: "error" });
        console.error("Error during fetch:", error);
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/orders/${id}?proceed=false`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          await response.json();
          enqueueSnackbar("Order cancelled.", { variant: "success" });
          fetchData();
        } else {
          enqueueSnackbar("Error", { variant: "error" });
          console.error("Order completion failed!");
        }
      } catch (error) {
        enqueueSnackbar("Server Error", { variant: "error" });
        console.error("Error during fetch:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    if (!isNaN(date)) {
      return `${dayOfWeek}, ${month}/${day}/${year} ${hour}:${minute}`;
    } else {
      return "";
    }
  };

  const calculateMilliseconds = (expiryDate, dateNow) => {
    const expiry = new Date(expiryDate);
    const now = new Date(dateNow);

    return expiry - now;
  };

  const columns = [
    {
      name: "Book Reference ID",
      selector: (row) => row.bookId?.bookRefID,
      sortable: true,
      wrap: true,
      // hide: "sm",
    },
    {
      name: "Title",
      selector: (row) => row.bookId?.title,
      sortable: true,
      wrap: true,
      hide: "sm",
    },
    {
      name: "Shelf Location",
      selector: (row) => row.bookId?.shelfLocation,
      sortable: true,
      wrap: true,
      hide: "md",
    },
    {
      name: "Borrower ID",
      selector: (row) => row.userId?.universityID,
      sortable: true,
      wrap: true,
      // hide: "sm",
    },
    {
      name: "Borrower email",
      selector: (row) => row.userId?.email,
      sortable: true,
      wrap: true,
      hide: "sm",
    },
    {
      name: "Date of Order",
      selector: (row) => formatDate(row.dateReserved),
      sortable: true,
      wrap: true,
      hide: "md",
    },
    {
      name: "Reservation Expiry",
      selector: (row) => formatDate(row.reserveDueDate),
      sortable: true,
      wrap: true,
      hide: "md",
    },
    {
      name: "Time Remaining",
      selector: (row) =>
        humanizeDuration(
          calculateMilliseconds(row.reserveDueDate, Date.now()),
          {
            units: ["d", "h", "m"],
            round: true,
          }
        ),
      sortable: true,
      wrap: true,
      hide: "sm",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="">
          <BsFillCheckCircleFill 
             size={25} 
            color="green" 
            style={{
              marginRight: '10px',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => handleBorrow(row._id)}/>
    
          <FcCancel 
            size={30} 
            color="red"
            style={{transition: 'transform 0.3s',}}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} 
            onClick={() => handleCancel(row._id)}
          />
        </div>
      ),
      wrap: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "40px",
      },
    },
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        wrap: true,
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };

  return (
    <>
      <DataTable
        title="List of Reserved Books"
        customStyles={customStyles}
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
            type="text"
            className="w-100 form-control"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        subHeaderAlign="right"
      />
    </>
  );
};

export default AdminReserveView;
