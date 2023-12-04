import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

const AdminHeader = () => {

  return (
    <>
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-primary data-bs-theme-dark mb-3">
          <Container fluid>
            <Navbar.Brand href="/admin">ONLINE LIBRARY</Navbar.Brand>
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
                  <Nav.Link href="/admin/addbook">Add Book</Nav.Link>
                  <Nav.Link href="/admin/userlist">All Users</Nav.Link>
                  <Nav.Link href="/admin/all-reserved-books">All Reserved</Nav.Link>
                  <Nav.Link href="/admin/all-borrowed-books">All Borrowed</Nav.Link>
                </Nav>
                <Button variant="success">
                  <Nav.Link href="/">Logout</Nav.Link>
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