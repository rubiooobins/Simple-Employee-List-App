import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import EmployeeList from './EmployeeList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <EmployeeList onLogout={handleLogout} />
      ) : showRegister ? (
        <>
          <Register onShowLogin={() => setShowRegister(false)} />
        </>
      ) : (
        <>
            <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
        </>
      )}
    </div>
  );
}

export default App;
