import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookies';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const getAllUsers = async () => {
        try {
            const token = Cookies.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/getAllUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response?.data?.message || error.message);
        }
    };

    const fetchUserChat = async (userId) => {
        try {
            const token = Cookies.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACK_END_URL}/chat/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setChatMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching chat:', error.message);
            setChatMessages([]);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserChat(user._id);
        setNewMessage('');
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = Cookies.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_BACK_END_URL}/chat/${selectedUser._id}`,
                { content: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const sentMsg = {
                content: newMessage,
                sender: 'admin',
                timestamp: new Date().toISOString(),
            };

            setChatMessages((prev) => [...prev, sentMsg]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Left sidebar: Users */}
            <div className="w-full sm:w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Users</h2>
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition ${selectedUser?._id === user._id ? 'bg-gray-700' : ''
                            }`}
                    >
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-300 truncate">{user.email}</p>
                        <span className={`text-xs ${user.isAdmin ? 'text-green-400' : 'text-yellow-400'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Right side: Chat */}
            <div className="flex-1 flex flex-col bg-gray-900 p-4 overflow-hidden">
                {selectedUser ? (
                    <>
                        <div className="border-b border-gray-700 pb-4 mb-4">
                            <h2 className="text-2xl font-bold text-blue-300">{selectedUser.name}</h2>
                            <p className="text-sm text-gray-400">{selectedUser.email}</p>
                            <p className="text-sm text-gray-400">{selectedUser._id}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {chatMessages.length > 0 ? (
                                chatMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-md max-w-xs ${msg.sender === 'admin' ? 'bg-blue-600 self-end ml-auto' : 'bg-gray-700 self-start mr-auto'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <p className="text-xs text-gray-300 mt-1 text-right">{msg.timestamp}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages found.</p>
                            )}
                        </div>

                        {/* Textarea + Send button */}
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
