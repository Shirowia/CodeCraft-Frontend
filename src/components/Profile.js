import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getUser, updateUserProfile } from '../firebase/firebaseUtils';
import '../styles/general.css';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    birthday: '',
    sex: '',
    address: '',
  });

  
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

  return (
    <div className="container mt-5">
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
  );
};

export default Profile;
