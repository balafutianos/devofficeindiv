// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Login from './Login/Login';
import Admin from './Homepage/Admin';
import User from './Homepage/User';
import Signup from './Signup/signup';
import Databasevis from './DatabaseVisualization/Users';
import Update from './DatabaseVisualization/Update';
import Frontend from './Room/FrontroomIadmin';
import FrontendUser from './Room/FrontroomIuser';
import Email from './Email/email';
import EmailUser from './Email/Emailreguser';
import Chat from './Chat';
import ChatUser from './ChatUser';
import Seats from './DatabaseVisualization/Seats';
import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
 
  const [role, setRole] = useState(null);

  useEffect(() => {
   
    const token = localStorage.getItem('token');
    if (token) {
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
    } else {
      console.error("No token found in localStorage.");
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            
            role === 'admin' ? <Navigate to="/admin" /> : role === 'user' ? <Navigate to="/user" /> : <Navigate to="/" />
          }
        />
        
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/signup" element={<Signup />}></Route>
        <Route path='/databasevis' element={<Databasevis />}/>
        <Route path='/seatsdtb' element={<Seats />}/>
        <Route path='/update/:id' element={<Update />}/>
        <Route path='/frontroom' element={<Frontend />}/>
        <Route path='/frontroomuser' element={<FrontendUser />}/>
        <Route path='/email' element={<Email />}/>
        <Route path='/emailuser' element={<EmailUser />}/>
        <Route path='/chat' element={<Chat />}/>
        <Route path='/chatuser' element={<ChatUser />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
