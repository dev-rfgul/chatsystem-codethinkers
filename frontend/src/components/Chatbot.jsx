
import Cookies from 'js-cookies';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

const ChatPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [chatID, setChatID] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [success, setSuccess] = useState('');
    useEffect(() => {
        const userCookie = Cookies.getItem('user');
        if (userCookie) {
            const parsed = JSON.parse(userCookie);
            setUser(parsed);
            console.log('User from cookie:', parsed);
        }
    }, []);
    const formatTimestamp = (timestamp) => {
        try {
            return new Date(timestamp).toLocaleString();
        } catch {
            return timestamp;
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
        useEffect(() => {
            scrollToBottom();
        }, [chatMessages]);
    
    useEffect(() => {
        if (user?.userID) {
            initializeChat();
            fetchUserMessages("6850fd7586194dbe2bf05986")
        }
    }, [user]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initializeChat = async () => {
        // Check if chat ID exists in cookies
        const chatCookie = Cookies.getItem('chatID');

        if (chatCookie) {
            // Chat ID exists, use it
            setChatID(chatCookie);
            console.log('Using existing chat ID:', chatCookie);
            // fetchUserMessages(chatCookie);
        } else {
            // No chat ID, generate a new one
            console.log('No chat ID found, generating new one...');
            await genChatID();
        }
    };

    const createUser = async () => {
        let userCookie = Cookies.getItem('user');
        let parsedUser = userCookie ? JSON.parse(userCookie) : null;

        if (!parsedUser) {
            console.log("No user found, registering a new one...");
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, {});
                parsedUser = res.data.user;
                console.log("Registered User:", parsedUser);

                Cookies.setItem('user', JSON.stringify(parsedUser), { expires: 7 });
                setUser(parsedUser);

                // Chat ID will be generated in the useEffect when user state updates
            } catch (error) {
                console.error("Registration failed", error);
                return;
            }
        } else {
            console.log("User already exists:", parsedUser);
            setUser(parsedUser);
            // Chat initialization will happen in useEffect
        }
    };

    const genChatID = async () => {
        if (!user?.userID) {
            console.error("Cannot generate chat ID: User ID not available");
            console.log(user.UserID)
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/chat`, {
                senderId: user.userID,
            });
            console.log("Chat response:", response.data);
            const newChatID = response.data.chatID; // Assuming your API returns chatID
            console.log("Generated Chat ID:", newChatID);

            // Store chat ID in cookies and state
            Cookies.setItem('chatID', newChatID, { expires: 7 });
            setChatID(newChatID);

            // Fetch messages for this chat
            fetchUserMessages(newChatID);

        } catch (err) {
            console.error("Chat creation failed", err);
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


    const handleSend = async (e) => {
        e.preventDefault();
        if (!userQuery.trim() || !user?.userID || !chatID) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/chat/message/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatID: "6850fd7586194dbe2bf05986",
                    userID: user.userID,
                    message: userQuery,
                    senderType: "user"
                })
            });

            const data = await res.json();
            console.log(data)
            setMessages(prev => [...prev, { user: userQuery, bot: data.answer }]);
            setUserQuery('');
            inputRef.current?.focus();
        } catch (error) {
            console.error('Send message failed:', error);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 h-[32rem] bg-white shadow-2xl rounded-lg border border-gray-300 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
                        <h2 className="font-semibold">CodeThinkers</h2>
                        <button onClick={() => setIsOpen(false)}>
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    {/* Welcome Message */}
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Feel free to ask about our services, courses, location, office hours, or anything else!
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
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'user'
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

                    {/* Input */}
                    <form onSubmit={handleSend} className="border-t px-3 py-2 bg-white flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 text-black text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                            disabled={!chatID} // Disable until chat ID is available
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        createUser();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
                >
                    <FiMessageCircle className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default ChatPopup;