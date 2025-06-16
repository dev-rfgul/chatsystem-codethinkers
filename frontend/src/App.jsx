import React from 'react'
import Chatbot from './components/Chatbot.jsx'
import Login from './components/Login.jsx'
import { Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin.jsx';
import Cookies from 'js-cookies'
import { useEffect } from 'react';

const App = () => {
  const isAdmin = () => {
    const cookie = Cookies.getItem('user')
    if (!cookie) return false;
    try {
      const user = JSON.parse(cookie);
      return user?.isAdmin === true;
    } catch (error) {
      console.error("invalid user cookie", error)
      return false
    }
  }
  useEffect(() => {
    isAdmin()
  }, [])
  return (
    <div className='bg-grey-900 min-h-screen'>
      <Routes>
        {/* Public components */}
        <Route path='/' element={
          <>
            <Login />
            <Chatbot />
          </>
        } />
        {/* Admin route (conditionally rendered if admin cookie exists) */}
        {isAdmin() && (
          <Route path='/admin' element={<Admin />} />
        )}
      </Routes>
    </div>
  )
}

export default App;
