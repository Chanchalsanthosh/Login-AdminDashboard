
/*
import React, { useContext } from 'react';
import './App.css';
import Login from './login';
import "./styles/login.css";
import Home from './pages/Home';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

function App() {
  //const { success } = useContext(AuthContext);

  return (
    <div className="App">

      <Router>
      <AuthProvider> 
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>} />
      </Routes>
      </AuthProvider> 
      </Router>

    </div>
  );
}

export default App;*/
// App.js
import React, { useContext } from 'react';
import './App.css';
import "./styles/login.css";
import Login from './login';
import Home from './pages/Home';
import Announcement from './pages/Announcement';
import Gallery from "./pages/Gallery";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider';
import AdBlogs from './pages/AdBlogs';
import AdCompanies from './pages/AdCompanies';
import AdEvents from './pages/AdEvents';
import AdStartup from './pages/AdStartup';
import Admentor from './pages/Admentor';
import Logout from './logout';


function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/adhome" /> : <Login />} />
          <Route path="/adhome" element={token ? <Home /> : <Navigate to="/" />} />
          <Route path="/adannounce" element={token ? <Announcement/> : <Navigate to="/"/>} />
          <Route path="/adgallery" element={token ? <Gallery/> : <Navigate to="/"/>} />
          <Route path="/adcompanies" element={token ? <AdCompanies/> : <Navigate to="/"/>} />
          <Route path="/adblogs" element={token ? <AdBlogs/> : <Navigate to="/"/>} />
          <Route path="/adevents" element={token ? <AdEvents/> : <Navigate to="/"/>} />
          <Route path="/adstartup" element={token ? <AdStartup/> : <Navigate to="/"/>} />
          <Route path="/admentor" element={token ? <Admentor/> : <Navigate to="/"/>} />
          <Route path="/logout" element={token ? <Logout/> : <Navigate to="/"/>} />
          {token && (
            <>
              <Route path="/adannounce" element={<Announcement />} />
              <Route path="/adgallery" element={<Gallery />} />
              <Route path="/adblogs" element={<AdBlogs />} />
              <Route path="/adcompanies" element={<AdCompanies />} />
              <Route path="/adevents" element={<AdEvents />} />
              <Route path="/adstartup" element={<AdStartup />} />
              <Route path="/admentor" element={<Admentor />} />
              <Route path="/logout" element={<Logout />} />
              
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
