import UserBookList from '../../components/book.components/UserBookList';
import UserHeader from '../../components/header.components/UserHeader';

const UserPage = () => {
  return (
    <div>
      <UserHeader />
      <br/>
      <UserBookList />
    </div>
  )
}

export default UserPage