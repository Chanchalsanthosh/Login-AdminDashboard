// Logout.jsx
import React, { useContext } from 'react';
import { AuthContext } from './context/AuthProvider';

const Logout = () => {
    const { setAuth } = useContext(AuthContext);

    const handleLogout = () => {
        // Clear authentication state
        setAuth(null);

        // Redirect to login page
        window.location.href = '/';
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
