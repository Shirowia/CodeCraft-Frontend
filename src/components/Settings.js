import React, { useState } from 'react';
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { Button, Form, Alert } from 'react-bootstrap';

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName });
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error updating profile: ' + error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(user, newPassword);
      setSuccessMessage('Password updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error updating password: ' + error.message);
    }
  };

  return (
    <div className="container mt-5 p-5 bg-light text-black rounded shadow">
      <h2 className="mb-4">Settings</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
      <Form onSubmit={handleProfileUpdate} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter new display name"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Update Profile
        </Button>
      </Form>

      <Form onSubmit={handlePasswordChange}>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Form.Group>
        <Button variant="danger" type="submit" className="w-100">
          Change Password
        </Button>
      </Form>
    </div>
  );
};

export default Settings;
