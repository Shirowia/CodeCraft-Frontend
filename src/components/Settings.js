import React, { useState, useEffect } from 'react';
import { getAuth, updatePassword, updateProfile, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { db, storage } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  
  const { t, i18n } = useTranslation();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    
    const fetchSettings = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setEmailNotifications(docSnap.data().emailNotifications);
        }
      }
    };
    fetchSettings();
  }, [darkMode, user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating profile: ' + error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(user, newPassword);
      setSuccessMessage('Password updated successfully!');
    } catch (error) {
      setErrorMessage('Error updating password: ' + error.message);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
      setSuccessMessage('Profile picture updated!');
    } catch (error) {
      setErrorMessage('Error uploading image: ' + error.message);
    }
  };

  const handleNotificationChange = async () => {
    setEmailNotifications(!emailNotifications);
    await setDoc(doc(db, 'users', user.uid), { emailNotifications: !emailNotifications }, { merge: true });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUser(user);
        alert('Account deleted successfully.');
      } catch (error) {
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex-container">
      <div className="flex-grow p-4 profile-center">
        <div className="profile-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{t('Settings')}</h2>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/menu')}
            >
              Close
            </button>
          </div>
          
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          
          <Form onSubmit={handleProfileUpdate} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>{t('Display Name')}</Form.Label>
              <Form.Control type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">{t('Update Profile')}</Button>
          </Form>

          <Form onSubmit={handlePasswordChange} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>{t('New Password')}</Form.Label>
              <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100">{t('Change Password')}</Button>
          </Form>

          <Form.Group className="mb-3">
            <Form.Label>{t('Profile Picture')}</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleProfilePictureUpload} />
          </Form.Group>

          <Form.Check type="switch" id="darkModeSwitch" label={t('Enable Dark Mode')} checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="mb-3" />

          <Form.Check type="switch" id="emailNotifications" label={t('Receive Email Notifications')} checked={emailNotifications} onChange={handleNotificationChange} className="mb-3" />

          <Form.Select className="mb-3" onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </Form.Select>

          <div className="d-flex gap-2 profile-btn mt-4">
            <Button variant="danger" onClick={handleDeleteAccount}>{t('Delete Account')}</Button>
            <Button variant="secondary" onClick={() => navigate('/menu')}>Back to Menu</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;