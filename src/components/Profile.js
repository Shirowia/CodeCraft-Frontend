import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getUser, updateUserProfile } from '../firebase/firebaseUtils';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    birthday: '',
    sex: '',
    address: '',
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userData = await getUser(user.uid);
        if (userData) {
          setProfile(userData);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const success = await updateUserProfile(user.uid, profile);
      if (success) {
        alert('Profile updated successfully!');
      } else {
        alert('Error updating profile.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex vh-100">
      <div className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? 'd-block' : 'd-none'}`} style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skilltree">Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/communities">Communities</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100"> Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <button className="btn btn-primary mb-3" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Birthday</label>
            <input
              type="date"
              className="form-control"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Sex</label>
            <select
              className="form-control"
              name="sex"
              value={profile.sex}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
