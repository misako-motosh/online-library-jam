import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import humanizeDuration from "humanize-duration";

const UserBorrowedView = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(["x", "x"]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = data.filter((data) => {
      const propertiesToSearch = [
        "bookRefID",
        "title",
        "shelfLocation",
        "universityID",
        "fullName",
        "lastName",
        "dateReserved",
        "reserveDueDate",
        "dateBorrowed",
        "returnDueDate",
        "dateReturned",
      ];
      const lowercasedSearch = search.toLowerCase();

      return propertiesToSearch.some((property) =>
        data[property].toString().toLowerCase().includes(lowercasedSearch)
      );
    });
    setFilter(result);
  }, [search]);

  const fetchData = async () => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/borrowed`
      );
      const response = await result.json();
      setData(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error(error);
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
    },
    {
      name: "Title",
      selector: (row) => row.bookId?.title,
      sortable: true,
    },
    {
      name: "Shelf Location",
      selector: (row) => row.bookId?.shelfLocation,
      sortable: true,
    },
    {
      name: "Return Deadline",
      selector: (row) => formatDate(row.dateReserved),
      sortable: true,
    },
    {
      name: "Time Remaining",
      selector: (row) =>
        humanizeDuration(calculateMilliseconds(row.returnDueDate, Date.now()), {
          units: ["d", "h", "m"],
          round: true,
        }),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  return (
    <>
      <h3>My Borrowed Books</h3>
      <DataTable
        columns={columns}
        data={filter}
        selectableRows
        selectableRowsHighlight
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
    </>
  );
};

export default UserBorrowedView;
