

// import Cookies from 'js-cookies';
// import axios from 'axios';
// import { useEffect, useState, useRef } from 'react';
// import { FiMessageCircle, FiX } from 'react-icons/fi';

// const ChatPopup = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [userQuery, setUserQuery] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [user, setUser] = useState(null);
//     const bottomRef = useRef(null);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         const userCookie = Cookies.getItem('user');
//         if (userCookie) {
//             const parsed = JSON.parse(userCookie);
//             setUser(parsed);
//             console.log(parsed)
//         }
//     }, []);

//     console.log(user)

//     useEffect(() => {
//         if (user?.userID) {
//             // fetchUserMessages();
//         }
//     }, [user]);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);
//     const createUser = async () => {
//         let userCookie = Cookies.getItem('user'); // ✅
//         let parsedUser = userCookie ? JSON.parse(userCookie) : null;

//         if (!parsedUser) {
//             console.log("No user found, registering a new one...");
//             try {
//                 const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, {});
//                 parsedUser = res.data.user;
//                 console.log("Registered User:", parsedUser);
//                 genChatID()
//                 Cookies.setItem('user', JSON.stringify(parsedUser), { expires: 7 }); // ✅
//                 setUser(parsedUser);
//                 console.log(parsedUser.userID)
//             } catch (error) {
//                 console.error("Registration failed", error);
//                 return;
//             }
//         } else {
//             console.log("User already exists:", parsedUser);
//             setUser(parsedUser);
//         }
//     };


//     const genChatID = async () => {
//         try {
//             const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/chat`, {
//                 senderID:'68500b3b7ddf07bd6f9ee3cc'
//                 // senderID: user.userID,
//             });
//             console.log("Chat response:", response.data);
//         } catch (err) {
//             console.error("Chat creation failed", err);
//         }
//     }

//     const fetchUserMessages = async () => {
//         if (!user?.userID) return;
//         try {
//             const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/message/${user.userID}`);
//             const formattedMessages = res.data.message.map(msg => ({
//                 user: msg.message || '...',
//                 bot: msg.answer || '...'
//             }));
//             setMessages(formattedMessages);
//         } catch (error) {
//             console.error("Failed to fetch messages", error);
//         }
//     };

//     const handleSend = async (e) => {
//         e.preventDefault();
//         if (!userQuery.trim() || !user?.userID) return;

//         try {
//             const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/message/sendMessage`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userID: user.userID,
//                     message: userQuery
//                 })
//             });

//             const data = await res.json();
//             setMessages(prev => [...prev, { user: userQuery, bot: data.answer }]);
//             setUserQuery('');
//             inputRef.current?.focus();
//         } catch (error) {
//             console.error('Send message failed:', error);
//         }
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             {isOpen ? (
//                 <div className="w-80 h-[32rem] bg-white shadow-2xl rounded-lg border border-gray-300 flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
//                         <h2 className="font-semibold">CodeThinkers</h2>
//                         <button onClick={() => setIsOpen(false)}>
//                             <FiX className="text-xl" />
//                         </button>
//                     </div>

//                     {/* Welcome Message */}
//                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                         Feel free to ask about our services, courses, location, office hours, or anything else!
//                     </div>

//                     {/* Chat Messages */}
//                     <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400">
//                         {messages.map((msg, index) => (
//                             <div key={index} className="bg-white p-3 rounded-md shadow-sm border">
//                                 <div className="text-blue-600 font-semibold mb-1">You:</div>
//                                 <div className="text-gray-800 mb-2">{msg.user}</div>
//                                 <div className="text-green-600 font-semibold mb-1">Bot:</div>
//                                 <div className="text-gray-800">{msg.bot}</div>
//                             </div>
//                         ))}
//                         <div ref={bottomRef} />
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
//                         />
//                         <button
//                             type="submit"
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
//                         >
//                             Send
//                         </button>
//                     </form>
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => {
//                         setIsOpen(true);
//                         createUser();
//                     }}
//                     className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
//                 >
//                     <FiMessageCircle className="text-2xl" />
//                 </button>
//             )}
//         </div>
//     );
// };

// export default ChatPopup;



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
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const userCookie = Cookies.getItem('user');
        if (userCookie) {
            const parsed = JSON.parse(userCookie);
            setUser(parsed);
            console.log('User from cookie:', parsed);
        }
    }, []);

    useEffect(() => {
        if (user?.userID) {
            initializeChat();
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
            fetchUserMessages(chatCookie);
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
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/chat/chat`, {
                senderID: user.userID,
            });
            
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

    const fetchUserMessages = async (currentChatID = chatID) => {
        if (!user?.userID || !currentChatID) return;
        
        try {
            // Modify this endpoint to fetch messages by chat ID instead of just user ID
            const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/message/${user.userID}/${currentChatID}`);
            const formattedMessages = res.data.message.map(msg => ({
                user: msg.message || '...',
                bot: msg.answer || '...'
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userQuery.trim() || !user?.userID || !chatID) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/message/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: user.userID,
                    chatID: chatID, // Include chat ID in the message
                    message: userQuery
                })
            });

            const data = await res.json();
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

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400">
                        {messages.map((msg, index) => (
                            <div key={index} className="bg-white p-3 rounded-md shadow-sm border">
                                <div className="text-blue-600 font-semibold mb-1">You:</div>
                                <div className="text-gray-800 mb-2">{msg.user}</div>
                                <div className="text-green-600 font-semibold mb-1">Bot:</div>
                                <div className="text-gray-800">{msg.bot}</div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
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