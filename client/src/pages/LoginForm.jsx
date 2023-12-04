import { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { AiFillEye } from 'react-icons/ai';
import userContext from '../../userContext';
import '../styles/loginFormStyle.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [universityID, setUniversityID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      try {
        const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/login`, { universityID, password });
        console.log(result);
        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('fullName', result.data.User);
            localStorage.setItem('fullName', result.data.UserRole);
            setUser({
              fullName: result.data.User,
              UserRole: result.data.UserRole,
              accessToken: result.data.accessToken
            });

          alert('Successful login');
          console.log(result.data.UserRole)
          setError('');

          if (result.data.UserRole === 'admin'){
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }
      } catch (err) {
        console.log(err)
        setError(err.response.data.message);
      }
    };
    
   //handle password toggle
   const toggle = () => {
    setOpen(!open);
  }

  return ( 
    <div className="Login">
      <div className="loginForm">
        <h1 className="h1-LoginForm">ONLINE LIBRARY</h1>
        <form className="form-LoginForm" onSubmit={handleSubmit}>
          <label className="label-LoginForm">University ID</label>
            <input
              className="input-LoginForm"
              type="text"
              value={universityID}
              onChange={(e) => setUniversityID(e.target.value)}
            />
          <label className="label-LoginForm">Password</label>
          <div className="password-LoginForm">
            <input 
              className="input-LoginForm"
              type={(open === false)? "password" : "text"}
              value={password}
              onChange={(e) =>setPassword(e.target.value)}
            />
            <div className="toggle-icon-password">
                {
                  (open === false) ? <AiFillEyeInvisible onClick={toggle}/> :
                  <AiFillEye onClick={toggle}/>
                }
            </div>
          </div>
          <br />
          <button className="btn-LoginForm" type="submit">Login</button>
        </form>
        <br />
        {error && <p className="p-LoginForm" style={{ color: 'red' }}>{error}</p>}
        <br />
        <p>Don't have an account yet? <Link className="link-LoginForm" to="/signup">SignUp now.</Link></p>
      </div>
    </div>
   );
}
 
export default LoginForm;