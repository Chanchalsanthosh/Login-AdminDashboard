import React, { useState, useRef, useContext } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from './api/axios';
//import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider';

const Login = () => {
  const userRef = useRef();
  const pwdRef = useRef();
  const { setToken } = useContext(AuthContext);

  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = userRef.current.value;
    const password = pwdRef.current.value;
    try {
      const response = await axios.post('/login', { username, password });
      if (response.status === 200) {
        const data = response.data;
        setToken(data.token);
      } else {
        setErrMsg(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrMsg('An error occurred. Please try again.');
    }
  };

  return (
    <div id="login1">
      <section className="wrapper1">
        <p className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
          {errMsg}
        </p>
        <div className="wrapper">
          <form onSubmit={handleSubmit} action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" ref={userRef} autoComplete="on" required />
              <FaUser />
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" ref={pwdRef} required />
              <FaLock />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
