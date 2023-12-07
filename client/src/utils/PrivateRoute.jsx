import { Outlet, Navigate} from 'react-router-dom';
import { useState } from 'react';

const PrivateRoute = ({allowedRole}) => {
  const [user, setUser] = useState(localStorage.getItem("UserRole")===allowedRole? true : null);
  
  return (
    user
    ? <Outlet /> 
    : <Navigate to='/Unauthorize' />

  )
}

export default PrivateRoute