import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import userContext from '../../../userContext';

const AdminHeader = () => {
  const { unsetUser } = useContext(userContext);
  const navigateTo = useNavigate()

  const logout = () => {
    unsetUser()
    navigateTo('/login')
  }

  return (
    <>
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-primary data-bs-theme-dark mb-3">
          <Container fluid>
            <Navbar.Brand href="/admin" className="nav-title text-white">ONLINE LIBRARY</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  ONLINE LIBRARY
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/admin/addbook" className="nav-link text-white">Add Book</Nav.Link>
                  <Nav.Link href="/admin/userlist" className="nav-link text-white">All Users</Nav.Link>
                  <Nav.Link href="/admin/all-reserved-books" className="nav-link text-white">All Reserved</Nav.Link>
                  <Nav.Link href="/admin/all-borrowed-books" className="nav-link text-white">All Borrowed</Nav.Link>
                </Nav>
                <Button variant="success">
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </Button>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}
export default AdminHeader;