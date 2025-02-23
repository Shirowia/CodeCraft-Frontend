import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log('User logged in:', userCredential.user);
      setError('');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg p-5 rounded">
        {/* Left Side - Login Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
        
        {/* Right Side - Logo */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '80%' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
