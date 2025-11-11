
import React from 'react';
import { useAppContext } from './context/AppContext';
import Login from './views/Login';
import ProfileSetup from './views/ProfileSetup';
import MainLayout from './views/MainLayout';

const App: React.FC = () => {
  const { isAuthenticated, isProfileSetup } = useAppContext();

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      {!isAuthenticated ? (
        <Login />
      ) : !isProfileSetup ? (
        <ProfileSetup />
      ) : (
        <MainLayout />
      )}
    </div>
  );
};

export default App;
