import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import MissingPage from './pages/MissingPage';

import UserPage from './pages/UserPages/UserPage';
import UserReserveBook from './pages/UserPages/UserReserveBook';
import UserBorrowedBook from './pages/UserPages/UserBorrowedBook';

import AdminPage from './pages/AdminPages/AdminPage';
import AddBook from './pages/AdminPages/AddBook';
import EditBook from './pages/AdminPages/EditBook';
import AdminUserlistView from './pages/AdminPages/AdminUserlistView';
import AllReservebook from './pages/AdminPages/AllReservebook';
import AllBorrowedbook from './pages/AdminPages/AllBorrowedbook';

import userContext from '../userContext';

const App = () => {
  const [user, setUser] = useState({ accessToken: localStorage.getItem('accessToken') })
  const unsetUser = () => {
    localStorage.clear()
    setUser({ accessToken: null })
  }
  const userContextData = useMemo(() => ({ user, setUser, unsetUser }));

  return (
    <>
      <userContext.Provider value={userContextData}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginForm />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/signup' element={<SignUpForm />} />

              <Route path='/user' element={<UserPage />} />
              <Route path='/user/reserve-books' element={<UserReserveBook />} />
              <Route path='/user/borrowed-books' element={<UserBorrowedBook />} />

              <Route path='/admin' element={<AdminPage />} />
              <Route path='/admin/addbook' element={<AddBook />} />
              <Route path='/admin/editbook/:id' element={<EditBook />} />
              <Route path='/admin/userlist' element={<AdminUserlistView />} />
              <Route path='/admin/all-reserved-books' element={<AllReservebook />} />
              <Route path='/admin/all-borrowed-books' element={<AllBorrowedbook />} />

              <Route path='*' element={<MissingPage />} />
            </Routes>
          </BrowserRouter>
      </userContext.Provider> 
    </>
  );
};
export default App;