import { Link } from "react-router-dom";

const UserHeader = () => {
  return (
    <nav className="navbar">
    <h1>ONLINE LIBRARY</h1>
    <div className="links">
      <Link to="/user/reserve-books">Reserve Books</Link>
      <Link to="/user/borrowed-books">Borrowed Books</Link>
      <a href="/">Logout</a>
    </div>
    </nav>
  );
}

export default UserHeader;