
import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Search, AlertCircle, CheckCircle } from 'lucide-react';
import Cookies from 'js-cookies'
import axios from 'axios'

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);


    const getAllUsers = async () => {
        setLoading(true);
        setError('');
        try {
            try {
                const token = Cookies.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/getAllUsers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setUsers(response.data);
                setUsers(response.data);
                setFilteredUsers(response.data);

            } catch (error) {
                console.error('Error fetching users:', error.response?.data?.message || error.message);
            }
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // setUsers(response.data);
            // setFilteredUsers(mockUsers);
        } catch (error) {
            setError('Failed to fetch users. Please try again.');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserMessages = async (chatID) => {
        if (!chatID) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/chat/messages/${chatID}`)
            console.log(response)
            console.log(response.data)
            const messages = response.data


            await new Promise(resolve => setTimeout(resolve, 300));

            const formattedMessages = messages.map(msg => ({
                content: msg.message,
                sender: msg.senderType || 'user',
                timestamp: new Date(msg.createdAt).toLocaleString(),
            }));

            setChatMessages(formattedMessages);
        } catch (error) {
            setError('Failed to fetch messages. Please try again.');
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserMessages(user.chatID);
        setNewMessage('');
        setError('');
        setSuccess('');
    };

const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setSendingMessage(true);
    setError('');

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/message`, {
            chatID: selectedUser.chatID,
            message: newMessage,
            senderType: "admin",
            userID: selectedUser._id
        });

        const sentMsg = {
            content: newMessage,
            sender: 'admin',
            timestamp: new Date().toLocaleString(),
        };

        setChatMessages(prev => [...prev, sentMsg]);
        setNewMessage('');
        setSuccess('Message sent successfully!');
        setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
        setError('Failed to send message. Please try again.');
        console.error('Error sending message:', error);
    } finally {
        setSendingMessage(false);
    }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(term.toLowerCase()) ||
                user.email.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const formatTimestamp = (timestamp) => {
        try {
            return new Date(timestamp).toLocaleString();
        } catch {
            return timestamp;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Left sidebar: Users */}
            <div className="w-full sm:w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Users ({filteredUsers.length})
                    </h2>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading && !selectedUser ? (
                        <div className="text-center text-gray-400 py-8">Loading users...</div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => handleUserClick(user)}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 border ${selectedUser?._id === user._id
                                    ? 'bg-gray-700 border-blue-500'
                                    : 'border-transparent hover:border-gray-600'
                                    }`}
                            >
                                <h3 className="font-semibold text-white">{user.name}</h3>
                                <p className="text-sm text-gray-300 truncate">{user.email}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className={`text-xs px-2 py-1 rounded ${user.isAdmin ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                                        }`}>
                                        {user.isAdmin ? 'Admin' : 'User'}
                                    </span>
                                    <span className="text-xs text-gray-400">ID: {user._id}</span>
                                </div>
                            </div>
                        ))
                    ) : searchTerm ? (
                        <div className="text-center text-gray-400 py-8">No users found for "{searchTerm}"</div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">No users available</div>
                    )}
                </div>
            </div>

            {/* Right side: Chat */}
            <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
                {selectedUser ? (
                    <>
                        {/* Chat header */}
                        <div className="border-b border-gray-700 p-4 bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-blue-300">{selectedUser.name}</h2>
                                    <p className="text-sm text-gray-400">{selectedUser.email}</p>
                                </div>
                            </div>  
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center gap-2 p-3 bg-green-900 border border-green-700 rounded-lg text-green-200">
                                    <CheckCircle className="w-5 h-5" />
                                    {success}
                                </div>
                            )}

                            {loading && chatMessages.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">Loading messages...</div>
                            ) : chatMessages.length > 0 ? (
                                <>
                                    {chatMessages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'admin'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-100'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.content}</p>
                                                <p className="text-xs opacity-70 mt-2">
                                                    {formatTimestamp(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No messages found. Start the conversation!
                                </div>
                            )}
                        </div>

                        {/* Message input */}
                        <div className="border-t border-gray-700 p-4 bg-gray-800">
                            <div className="flex gap-3">
                                <textarea
                                    ref={textareaRef}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                                    className="flex-1 h-20 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={sendingMessage}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors duration-200 flex items-center gap-2 self-end"
                                >
                                    {sendingMessage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                        <div className="text-center">
                            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Select a user to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;