// import React from 'react'
// import Chatbot from './components/Chatbot.jsx'
// import Login from './components/Login.jsx'
// import { Route, Routes } from 'react-router-dom';
// import Admin from './pages/Admin.jsx';
// import Cookies from 'js-cookies'

// const App = () => {
//   const isAdmin = () => {
//     const user = Cookies.getItem('user')
//     console.log(user)
//   }
//   return (
//     <div className='bg-grey-900'>
//       <header className='bg-gray-800 text-white p-4 text-center'>
//         <h1 className='text-2xl font-bold'>CodeThinkers Chatbot</h1>
//         <button className='mt-2 ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'>
//           Login</button>
//       </header>
//       <Login />
//       <Chatbot />
//       <Routes>
//         {isAdmin === true && (
//           <Route path='/admin' element={<Admin />} />
//         )}
//       </Routes>
//     </div>
//   )
// }

// export default App

import React from 'react'
import Chatbot from './components/Chatbot.jsx'
import Login from './components/Login.jsx'
import { Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin.jsx';
import Cookies from 'js-cookies'
import { useEffect } from 'react';

const App = () => {
  const isAdmin = () => {
    const user = JSON.parse(Cookies.getItem('user'));
    console.log(user)
    if (user.isAdmin === true) {
      return true
    }
    else return false
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
