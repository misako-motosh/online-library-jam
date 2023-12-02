import AdminBookList from '../../components/book.components/AdminBookList';
import AdminHeader from '../../components/header.components/AdminHeader';

const AdminPage = () => {
  return (
    <div>
      <AdminHeader />
      <br/>
      <h1>AdminPage</h1>
      <AdminBookList />
    </div>
  )
}

export default AdminPage