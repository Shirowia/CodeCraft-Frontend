import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getUser, updateUserProfile } from '../firebase/firebaseUtils';
import { useNavigate } from 'react-router-dom';
import '../styles/general.css';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  
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
          setOriginalProfile(userData); // Store original data
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const updatedProfile = { ...profile, [e.target.name]: e.target.value };
    setProfile(updatedProfile);
    // Check if any values are different from original
    const changed = Object.keys(updatedProfile).some(
      key => updatedProfile[key] !== originalProfile[key]
    );
    setHasChanges(changed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const success = await updateUserProfile(user.uid, profile);
      if (success) {
        navigate('/menu');
      } else {
        alert('Error updating profile.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  return (
    <div className="flex-container">

      <div className="flex-grow p-4 profile-center">
        <div className="profile-container">
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

          <div className="d-flex gap-2 profile-btn mt-4">
            <button 
              type="submit" 
              className="btn-secondary"
              disabled={!hasChanges}
            >
              SAVE
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleCancel}
            >
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </div>
    </div>
  );
};

export default Profile;
