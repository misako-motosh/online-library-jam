import UserBookList from '../../components/book.components/UserBookList';
import UserHeader from '../../components/header.components/UserHeader';

const UserPage = () => {
  return (
    <div>
      <UserHeader />
      <br/>
      <h1>UserPage</h1>
      <UserBookList />
    </div>
  )
}

export default UserPage