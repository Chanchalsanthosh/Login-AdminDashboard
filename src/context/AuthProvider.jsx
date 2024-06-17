
/*import { createContext, useState } from 'react';

const AuthContext = createContext({});

export { AuthContext }; // Export AuthContext

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState(false);

    return (
        <AuthContext.Provider value={{ token, setToken , success, setSuccess}}>
            {children}
        </AuthContext.Provider>
    )
}*/
// AuthProvider.jsx
import React, { createContext, useState } from 'react';

const AuthContext = createContext({});

export { AuthContext }; // Export AuthContext

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState(false);

    const setAuth = (authData) => {
        if (authData) {
            setToken(authData.token);
            setSuccess(true);
        } else {
            setToken('');
            setSuccess(false);
        }
    };

    return (
        <AuthContext.Provider value={{ token, setToken, success, setSuccess, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}


