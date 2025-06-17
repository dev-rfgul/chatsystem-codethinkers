import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookies'



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACK_END_URL}/user/login`,
                {
                    email,
                    password,
                }
            );

            const data = response.data;
            console.log(data)
            if (data) {
                console.log('Login successful!');

                // Save token in localStorage
                // localStorage.setItem('token', response.data.token);
                Cookies.setItem('token', data.token, { expires: 30 })
                Cookies.setItem('user', JSON.stringify(data.user), { expires: 30 })
                if (data.user.isAdmin) {
                    navigate('/admin')
                }
            }
            else {
                console.log('Login failed: ' + response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
        }
    };
    // const token = Cookies.getItem('token');
    // console.log(token);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-500">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
