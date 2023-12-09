import EditBookEntryForm from '../../components/book.components/EditBookEntryForm';
import AdminHeader from '../../components/header.components/AdminHeader';
import { useParams } from 'react-router-dom';

const EditBook = () => {
  const { id } = useParams()
  return (
    <div>
      <AdminHeader />
      <br />
      <EditBookEntryForm _id={id} />
    </div>
  )
}

export default EditBook