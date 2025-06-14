import React from 'react'
import Chatbot from './components/Chatbot.jsx'
import Login from './components/Login.jsx'
const App = () => {
  return (
    <div className='bg-grey-900'>
      <header className='bg-gray-800 text-white p-4 text-center'>
        <h1 className='text-2xl font-bold'>CodeThinkers Chatbot</h1>
        <button className='mt-2 ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'>
          Login</button>
      </header>
      <Login />
      <Chatbot />
    </div>
  )
}

export default App