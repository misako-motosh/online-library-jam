import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <nav className="navbar">
    <h1>ONLINE LIBRARY</h1>
    <div className="links">
      <Link to="/admin/addbook">Add Book</Link>
      <Link to="/admin/userlist">Users</Link>
      <Link to="/admin/all-reserved-books">Reserved</Link>
      <Link to="/admin/all-borrowed-books">Borrowed</Link>
      <a href="/">Logout</a>
    </div>
    </nav>
  );
}

export default AdminHeader;