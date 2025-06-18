import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import chatRoutes from './routes/chatRoute.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Connected users map
const connectedUser = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining (matches frontend "join" event)
    socket.on("join", ({ userId, role }) => {
        socket.userId = userId;
        socket.role = role;
        connectedUser[userId] = socket.id;
        console.log(`User ${userId} with role ${role} joined with socket ID: ${socket.id}`);
    });

    // Handle joining a chat room (matches frontend "join-room" event)
    socket.on("join-room", (chatID) => {
        socket.join(chatID);
        console.log(`Socket ${socket.id} joined room: ${chatID}`);
    });

    // Handle leaving a chat room (matches frontend "leave-room" event)
    socket.on("leave-room", (chatID) => {
        socket.leave(chatID);
        console.log(`Socket ${socket.id} left room: ${chatID}`);
    });

    // Handle sending a message (matches frontend "sendMessage" event)
    socket.on("sendMessage", (messageData) => {
        console.log(`Message received:`, messageData);

        const { chatID, message, senderType, timestamp } = messageData;

        // Broadcast message to all users in the chat room (matches frontend "receive-message" event)
        io.to(chatID).emit("receive-message", {
            message,
            senderType,
            timestamp: timestamp || new Date().toISOString(),
            chatID
        });

        console.log(`Message broadcasted to room ${chatID}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId) {
            delete connectedUser[socket.userId];
            console.log(`User ${socket.userId} disconnected`);
        }
    });
});

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io, connectedUser };