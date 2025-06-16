// import Cookies from 'js-cookies'
// import axios from 'axios'
// import { useEffect, useState, useRef } from "react";
// import { FiMessageCircle, FiX } from "react-icons/fi";

// const ChatPopup = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [userQuery, setUserQuery] = useState('');
//     const [answer, setAnswer] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [user,setUser]=useState('')
//     const bottomRef = useRef(null);
//     const inputRef = useRef(null);

//     // const user = JSON.parse(Cookies.getItem('user'));
//     // console.log("User from cookie:", user.userID); // ✅ Correctly parse the cookie to get user data
//     // console.log(user)
// useEffect(()=>{
//     setUser(JSON.parse(Cookies.getItem('user')))
// },[])

// console.log(user)


//     const createUser = async () => {
//         const user = Cookies.getItem('user'); // ✅ get cookie using js-cookie

//         const response =await axios.get(`${import.meta.env.VITE_BACK_END_URL}/message/684fb46c39ca8a9d3b30b9ff`)
//         console.log(response.data)
//         if (!user) {
//             try {
//                 const response = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, {});
//                 console.log(response.data);

//                 // Optionally set cookie after successful register
//                 Cookies.setItem('user', JSON.stringify(response.data.user), { expires: 7 }); // expires in 7 days
//             } catch (error) {
//                 console.error("Registration failed", error);
//             }
//         } else {
//             console.log("User already exists in cookie:", user);
//         }
//     };
//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);





// const handleSend = async (e) => {
//     e.preventDefault();
//     if (!userQuery.trim()) return;
//     try {
//         const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/message/sendMessage`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 userID: user?.userID, // <- Correct usage from cookie
//                 message: userQuery,
//             }),
//         });

//         const data = await response.json();
//         console.log(data)

//         setMessages([...messages, { user: userQuery, bot: data.answer }]);
//         setUserQuery('');
//         inputRef.current.focus();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };


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

//                     {/* Input Field */}
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
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const userCookie = Cookies.getItem('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const createUser = async () => {
        let userCookie = Cookies.getItem('user');
        let parsedUser = userCookie ? JSON.parse(userCookie) : null;

        if (!parsedUser) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, {});
                parsedUser = res.data.user;
                Cookies.setItem('user', JSON.stringify(parsedUser), { expires: 7 });
                setUser(parsedUser);
            } catch (error) {
                console.error("Registration failed", error);
                return;
            }
        } else {
            setUser(parsedUser);
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/message/${parsedUser.userID}`);
            const formattedMessages = res.data.message.map(msg => ({
                user: msg.message,
                bot: msg.answer||'...'
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userQuery.trim() || !user) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/message/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: user.userID,
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
