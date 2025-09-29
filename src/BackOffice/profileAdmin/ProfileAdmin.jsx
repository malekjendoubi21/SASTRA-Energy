import React, { useEffect } from 'react';
import BackOfficeMenu from '../components/BackOfficeMenu';
import Profile from '../../FrontOffice/profile/Profile';
import './ProfileAdmin.css';

const ProfileAdmin = ({ onNavigate, onLogout, currentPage }) => {
  useEffect(() => {
    const userType = localStorage.getItem('typeUser');
    if (userType !== 'admin') {
      onNavigate('profile');
      return;
    }
  }, [onNavigate]);

  return (
    <div className="profile-admin-container">
      <BackOfficeMenu
        onNavigate={onNavigate}
        onLogout={onLogout}
        currentPage={currentPage}
      />
      <div className="profile-admin-content">
        <Profile onLogout={onLogout} />
      </div>
    </div>
  );
};

export default ProfileAdmin;
