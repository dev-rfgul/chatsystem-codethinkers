// import { io } from 'socket.io-client'
// import Cookies from 'js-cookies';
// import axios from 'axios';
// import { useEffect, useState, useRef } from 'react';
// import { FiMessageCircle, FiX } from 'react-icons/fi';

// const socket = io("http://localhost:3000", {
//     withCredentials: true,
//     transports: ['websocket'],
// });
// const ChatPopup = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [userQuery, setUserQuery] = useState('');
//     const [user, setUser] = useState(null);
//     const [chatID, setChatID] = useState(null);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const bottomRef = useRef(null);
//     const inputRef = useRef(null);
//     const messagesEndRef = useRef(null);


//     useEffect(() => {
//     socket.on("connect", () => {
//         console.log("Connected to socket:", socket.id);
//     });

//     socket.on("newMessage", (msg) => {
//         console.log("Received real-time message:", msg);
//     });

//     socket.on("connect_error", (err) => {
//         console.error("Socket connection error:", err);
//     });
// }, []);



//     useEffect(() => {
//         const userCookie = Cookies.getItem('user');
//         if (userCookie) {
//             try {
//                 const parsed = JSON.parse(userCookie);
//                 setUser(parsed);
//                 // Set chatID from user cookie if it exists
//                 if (parsed.chatID) {
//                     setChatID(parsed.chatID);
//                 }
//                 console.log('User from cookie:', parsed);
//             } catch (error) {
//                 console.error('Error parsing user cookie:', error);
//                 // Clear invalid cookie
//                 Cookies.removeItem('user');
//             }
//         }
//     }, []);

//     const formatTimestamp = (timestamp) => {
//         try {
//             return new Date(timestamp).toLocaleString();
//         } catch {
//             return timestamp;
//         }
//     };

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [chatMessages]);

//     useEffect(() => {
//         if (user?.userID) {
//             initializeChat();
//         }
//     }, [user]);

//     useEffect(() => {
//         if (chatID) {
//             fetchUserMessages(chatID);
//         }
//     }, [chatID]);

//     const initializeChat = async () => {
//         // Check if user already has chatID
//         if (user?.chatID) {
//             setChatID(user.chatID);
//             console.log('Using existing chat ID from user:', user.chatID);
//             return;
//         }

//         // Check if chat ID exists in cookies (fallback)
//         const chatCookie = Cookies.getItem('chatID');
//         if (chatCookie) {
//             setChatID(chatCookie);
//             console.log('Using existing chat ID from cookie:', chatCookie);
//             // Update user object with chatID
//             updateUserWithChatID(chatCookie);
//             return;
//         }

//         // No chat ID found, generate a new one
//         console.log('No chat ID found, generating new one...');
//         await genChatID();
//     };

//     const updateUserWithChatID = (chatID) => {
//         const updatedUser = { ...user, chatID };
//         setUser(updatedUser);
//         Cookies.setItem('user', JSON.stringify(updatedUser), { expires: 7 });
//         console.log('Updated user with chatID:', updatedUser);
//     };

//     const createUser = async () => {
//         let userCookie = Cookies.getItem('user');
//         let parsedUser = userCookie ? JSON.parse(userCookie) : null;

//         if (!parsedUser) {
//             console.log("No user found, registering a new one...");
//             try {
//                 const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, {});
//                 parsedUser = res.data.user;
//                 console.log("Registered User:", parsedUser);

//                 // Store user in cookie
//                 Cookies.setItem('user', JSON.stringify(parsedUser), { expires: 7 });
//                 setUser(parsedUser);

//                 // Get updated user data
//                 await getUserByID(parsedUser.userID);
//             } catch (error) {
//                 console.error("Registration failed", error);
//                 setError("Failed to register user. Please try again.");
//                 return;
//             }
//         } else {
//             console.log("User already exists:", parsedUser);
//             setUser(parsedUser);
//         }
//     };

//     const genChatID = async () => {
//         if (!user?.userID) {
//             console.error("Cannot generate chat ID: User ID not available");
//             return;
//         }

//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/chat`, {
//                 senderId: user.userID,
//             });

//             // Fixed: Check response.status instead of response.ok (axios doesn't have ok property)
//             if (response.status === 200 || response.status === 201) {
//                 console.log("Chat response:", response.data);

//                 // Extract chatID from response if available
//                 if (response.data.chatID) {
//                     setChatID(response.data.chatID);
//                     updateUserWithChatID(response.data.chatID);
//                 } else {
//                     // Refresh user data to get the new chatID
//                     await getUserByID(user.userID);
//                 }
//             }
//         } catch (err) {
//             console.error("Chat creation failed", err);
//             setError("Failed to create chat. Please try again.");
//         }
//     };

//     const getUserByID = async (userID) => {
//         if (!userID) {
//             console.error("Cannot fetch user: User ID not available");
//             return;
//         }

//         try {
//             const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/${userID}`);
//             console.log("Fetched User:", response.data);

//             const userData = response.data.user;
//             setUser(userData);
//             Cookies.setItem('user', JSON.stringify(userData), { expires: 7 });

//             // Set chatID if available
//             if (userData.chatID) {
//                 setChatID(userData.chatID);
//             }
//         } catch (err) {
//             console.error("Failed to fetch user", err);
//             setError("Failed to fetch user data. Please try again.");
//         }
//     };

//     const fetchUserMessages = async (chatID) => {
//         if (!chatID) return;

//         setLoading(true);
//         setError('');
//         try {
//             // Fixed: Use chatID parameter instead of hardcoded cookie reference
//             const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/chat/messages/${chatID}`);
//             console.log("Messages response:", response.data);

//             const messages = response.data;

//             // Optional delay for better UX
//             await new Promise(resolve => setTimeout(resolve, 300));

//             const formattedMessages = messages.map(msg => ({
//                 content: msg.message,
//                 sender: msg.senderType || 'user',
//                 timestamp: new Date(msg.createdAt).toLocaleString(),
//             }));

//             setChatMessages(formattedMessages);
//         } catch (error) {
//             setError('Failed to fetch messages. Please try again.');
//             console.error("Failed to fetch messages", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSend = async (e) => {
//         e.preventDefault();
//         if (!userQuery.trim() || !user?._id || !chatID) {
//             if (!user?.userID) {
//                 setError("User not authenticated. Please refresh the page.");
//             } else if (!chatID) {
//                 setError("Chat not initialized. Please try again.");
//             }
//             return;
//         }

//         // Add user message immediately to the UI
//         const userMessage = {
//             content: userQuery,
//             sender: 'user',
//             timestamp: new Date().toLocaleString(),
//         };

//         setChatMessages(prev => [...prev, userMessage]);
//         const currentMessage = userQuery;
//         setUserQuery(''); // Clear input immediately
//         setError(''); // Clear any previous errors

//         try {
//             const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/chat/message/`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     chatID: chatID,
//                     userID: user._id,
//                     message: currentMessage,
//                     senderType: "user"
//                 })
//             });

//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
//             socket.emit('sendMessage', {
//                 chatID,
//                 userID: user._id,
//                 message: currentMessage,
//                 senderType: 'user',
//             });
            
//             const data = await res.json();
//             console.log("Send message response:", data);

//             // Add bot response to the UI if there's an answer
//             if (data.answer) {
//                 const botMessage = {
//                     content: data.answer,
//                     sender: 'bot',
//                     timestamp: new Date().toLocaleString(),
//                 };
//                 setChatMessages(prev => [...prev, botMessage]);
//             }

//             inputRef.current?.focus();
//         } catch (error) {
//             console.error('Send message failed:', error);
//             setError('Failed to send message. Please try again.');

//             // Remove the user message from UI since it failed to send
//             setChatMessages(prev => prev.filter(msg =>
//                 !(msg.content === currentMessage && msg.sender === 'user')
//             ));

//             // Restore the message in the input
//             setUserQuery(currentMessage);
//         }
//     };

//     // Handle opening chat popup
//     const handleOpenChat = () => {
//         setIsOpen(true);
//         if (!user) {
//             createUser();
//         }
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             {isOpen ? (
//                 <div className="w-80 h-[32rem] bg-white shadow-2xl rounded-lg border border-gray-300 flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
//                         <h2 className="font-semibold">CodeThinkers</h2>
//                         <button
//                             onClick={() => setIsOpen(false)}
//                             className="hover:bg-blue-700 p-1 rounded"
//                         >
//                             <FiX className="text-xl" />
//                         </button>
//                     </div>

//                     {/* Welcome Message */}
//                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                         Feel free to ask about our services, courses, location, office hours, or anything else!
//                     </div>

//                     {/* Messages area */}
//                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                         {error && (
//                             <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
//                                 <span>⚠️</span>
//                                 <span className="text-sm">{error}</span>
//                             </div>
//                         )}

//                         {success && (
//                             <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
//                                 <span>✅</span>
//                                 <span className="text-sm">{success}</span>
//                             </div>
//                         )}

//                         {loading && chatMessages.length === 0 ? (
//                             <div className="text-center text-gray-400 py-8">Loading messages...</div>
//                         ) : chatMessages.length > 0 ? (
//                             <>
//                                 {chatMessages.map((msg, idx) => (
//                                     <div
//                                         key={idx}
//                                         className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                                     >
//                                         <div
//                                             className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'user'
//                                                 ? 'bg-blue-600 text-white'
//                                                 : 'bg-gray-700 text-gray-100'
//                                                 }`}
//                                         >
//                                             <p className="text-sm">{msg.content}</p>
//                                             <p className="text-xs opacity-70 mt-2">
//                                                 {formatTimestamp(msg.timestamp)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <div ref={messagesEndRef} />
//                             </>
//                         ) : (
//                             <div className="text-center text-gray-500 py-8">
//                                 No messages found. Start the conversation!
//                             </div>
//                         )}
//                     </div>

//                     {/* Input */}
//                     <form onSubmit={handleSend} className="border-t px-3 py-2 bg-white flex gap-2">
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             value={userQuery}
//                             onChange={(e) => setUserQuery(e.target.value)}
//                             placeholder="Type a message..."
//                             className="flex-1 px-3 py-2 text-black text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             disabled={!chatID}
//                         />
//                         <button
//                             type="submit"
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
//                             disabled={!chatID || !userQuery.trim()}
//                         >
//                             Send
//                         </button>
//                     </form>
//                 </div>
//             ) : (
//                 <button
//                     onClick={handleOpenChat}
//                     className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
//                 >
//                     <FiMessageCircle className="text-2xl" />
//                 </button>
//             )}
//         </div>
//     );
// };

// export default ChatPopup;

import { io } from 'socket.io-client'
import Cookies from 'js-cookies';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

const ChatPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [user, setUser] = useState(null);
    const [chatID, setChatID] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            withCredentials: true,
            transports: ['websocket'],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("User connected to socket:", socket.id);
        });

        // Listen for messages from admin
        socket.on("receive-message", (msg) => {
            console.log("User received message from admin:", msg);
            setChatMessages(prev => [...prev, {
                content: msg.message,
                sender: msg.senderType || 'admin',
                timestamp: msg.timestamp || new Date().toLocaleString()
            }]);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected from socket");
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Join room when chatID and user are available
    useEffect(() => {
        const socket = socketRef.current;
        if (socket && user && chatID) {
            // Join as user
            socket.emit("join", { userId: user._id, role: "user" });
            // Join chat room
            socket.emit("join-room", chatID);
            console.log("User joined room:", chatID);
        }
    }, [user, chatID]);

    useEffect(() => {
        const userCookie = Cookies.getItem('user');
        if (userCookie) {
            try {
                const parsed = JSON.parse(userCookie);
                setUser(parsed);
                // Set chatID from user cookie if it exists
                if (parsed.chatID) {
                    setChatID(parsed.chatID);
                }
                console.log('User from cookie:', parsed);
            } catch (error) {
                console.error('Error parsing user cookie:', error);
                // Clear invalid cookie
                Cookies.removeItem('user');
            }
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
        }
    }, [user]);

    useEffect(() => {
        if (chatID) {
            fetchUserMessages(chatID);
        }
    }, [chatID]);

    const initializeChat = async () => {
        // Check if user already has chatID
        if (user?.chatID) {
            setChatID(user.chatID);
            console.log('Using existing chat ID from user:', user.chatID);
            return;
        }

        // Check if chat ID exists in cookies (fallback)
        const chatCookie = Cookies.getItem('chatID');
        if (chatCookie) {
            setChatID(chatCookie);
            console.log('Using existing chat ID from cookie:', chatCookie);
            // Update user object with chatID
            updateUserWithChatID(chatCookie);
            return;
        }

        // No chat ID found, generate a new one
        console.log('No chat ID found, generating new one...');
        await genChatID();
    };

    const updateUserWithChatID = (chatID) => {
        const updatedUser = { ...user, chatID };
        setUser(updatedUser);
        Cookies.setItem('user', JSON.stringify(updatedUser), { expires: 7 });
        console.log('Updated user with chatID:', updatedUser);
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

                // Store user in cookie
                Cookies.setItem('user', JSON.stringify(parsedUser), { expires: 7 });
                setUser(parsedUser);

                // Get updated user data
                await getUserByID(parsedUser.userID);
            } catch (error) {
                console.error("Registration failed", error);
                setError("Failed to register user. Please try again.");
                return;
            }
        } else {
            console.log("User already exists:", parsedUser);
            setUser(parsedUser);
        }
    };

    const genChatID = async () => {
        if (!user?.userID) {
            console.error("Cannot generate chat ID: User ID not available");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/chat`, {
                senderId: user.userID,
            });

            if (response.status === 200 || response.status === 201) {
                console.log("Chat response:", response.data);

                // Extract chatID from response if available
                if (response.data.chatID) {
                    setChatID(response.data.chatID);
                    updateUserWithChatID(response.data.chatID);
                } else {
                    // Refresh user data to get the new chatID
                    await getUserByID(user.userID);
                }
            }
        } catch (err) {
            console.error("Chat creation failed", err);
            setError("Failed to create chat. Please try again.");
        }
    };

    const getUserByID = async (userID) => {
        if (!userID) {
            console.error("Cannot fetch user: User ID not available");
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/user/${userID}`);
            console.log("Fetched User:", response.data);

            const userData = response.data.user;
            setUser(userData);
            Cookies.setItem('user', JSON.stringify(userData), { expires: 7 });

            // Set chatID if available
            if (userData.chatID) {
                setChatID(userData.chatID);
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
            setError("Failed to fetch user data. Please try again.");
        }
    };

    const fetchUserMessages = async (chatID) => {
        if (!chatID) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/chat/messages/${chatID}`);
            console.log("Messages response:", response.data);

            const messages = response.data;

            // Optional delay for better UX
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
        if (!userQuery.trim() || !user?._id || !chatID) {
            if (!user?.userID) {
                setError("User not authenticated. Please refresh the page.");
            } else if (!chatID) {
                setError("Chat not initialized. Please try again.");
            }
            return;
        }

        // Add user message immediately to the UI
        const userMessage = {
            content: userQuery,
            sender: 'user',
            timestamp: new Date().toLocaleString(),
        };

        setChatMessages(prev => [...prev, userMessage]);
        const currentMessage = userQuery;
        setUserQuery(''); // Clear input immediately
        setError(''); // Clear any previous errors

        try {
            // Send to database
            const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/chat/message/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatID: chatID,
                    userID: user._id,
                    message: currentMessage,
                    senderType: "user"
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // Emit socket event to admin
            const socket = socketRef.current;
            if (socket) {
                socket.emit('send-message', {
                    chatID,
                    message: currentMessage,
                    senderType: 'user',
                    receiverId: 'admin',
                    timestamp: new Date().toLocaleString()
                });
                console.log('Message sent via socket:', currentMessage);
            }
            
            const data = await res.json();
            console.log("Send message response:", data);

            // Add bot response to the UI if there's an answer
            if (data.answer) {
                const botMessage = {
                    content: data.answer,
                    sender: 'bot',
                    timestamp: new Date().toLocaleString(),
                };
                setChatMessages(prev => [...prev, botMessage]);
            }

            inputRef.current?.focus();
        } catch (error) {
            console.error('Send message failed:', error);
            setError('Failed to send message. Please try again.');

            // Remove the user message from UI since it failed to send
            setChatMessages(prev => prev.filter(msg =>
                !(msg.content === currentMessage && msg.sender === 'user')
            ));

            // Restore the message in the input
            setUserQuery(currentMessage);
        }
    };

    // Handle opening chat popup
    const handleOpenChat = () => {
        setIsOpen(true);
        if (!user) {
            createUser();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 h-[32rem] bg-white shadow-2xl rounded-lg border border-gray-300 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
                        <h2 className="font-semibold">CodeThinkers</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-blue-700 p-1 rounded"
                        >
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
                            <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                                <span>⚠️</span>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
                                <span>✅</span>
                                <span className="text-sm">{success}</span>
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
                                            className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                                                msg.sender === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : msg.sender === 'admin' 
                                                        ? 'bg-green-600 text-white'
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
                            disabled={!chatID}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!chatID || !userQuery.trim()}
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={handleOpenChat}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
                >
                    <FiMessageCircle className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default ChatPopup;