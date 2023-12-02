import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { AiFillEye } from 'react-icons/ai';
import axios from 'axios';

import '../styles/loginFormStyle.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    universityID: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newUser = {
      universityID: formData.universityID,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };
      // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password must match');
      return;
    }

    try {
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, newUser);
      alert('Successful registration');
      // Clear previous error if any
        setError('');
        navigate('/login');
        console.log(result);
    } catch (err) {
        setError(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle password toggle
  const toggle = () => {
    setOpen(!open);
  }

  return (
    <div className="SignUpForm">
      <h1 className="h1-SignUpForm">ONLINE LIBRARY</h1>
      <form className="form-SignUpForm" onSubmit={handleSubmit}>
        <label className="label-SignUpForm">First Name</label>
        <input
          className="input-SignUpForm"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label className="label-SignUpForm">Last Name</label>
        <input
          className="input-SignUpForm"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label className="label-SignUpForm">University ID</label>
        <input
          className="input-SignUpForm"
          type="text"
          name="universityID"
          value={formData.universityID}
          onChange={handleChange}
        />
        <label className="label-SignUpForm">Email:</label>
        <input
          className="input-SignUpForm"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label className="label-SignUpForm">Password:</label>
          <div className="password-SignUpForm">
            <input
              className="input-SignUpForm"
              type={(open === false)? "password" : "text"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="toggle-icon-password">
              {
                (open === false) ? <AiFillEyeInvisible onClick={toggle}/> :
                <AiFillEye onClick={toggle}/>
              }
            </div>
          </div>
        <label className="label-SignUpForm">Confirm Password:</label>
          <div className="confirmPassword-SignUpForm">
            <input
              className="input-SignUpForm"
              type={(open === false)? "password" : "text"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="toggle-icon-confirmPassword">
              {
                (open === false) ? <AiFillEyeInvisible onClick={toggle}/> :
                <AiFillEye onClick={toggle}/>
              }
            </div>
          </div>
        {error && <p className="p-SignUpForm" style={{ color: 'red' }}>{error}</p>}
        <br />
        <button className="btn-SignUpForm" type="submit">Signup</button>
      </form>
      <br />
      <p>Already have an account? <Link className="link-SignUpForm" to="/login">SignIn now.</Link></p>
    </div>
  );
};

export default SignUpForm;