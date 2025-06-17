// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import http from 'http';
// import https from 'https';
// import { Server} from 'socket.io';
// import { connectDB } from './config/db.js';
// import userRoutes from './routes/userRoutes.js';
// import messageRoutes from './routes/messageRoutes.js'
// import chatRoutes from './routes/chatRoute.js'
// const app = express();

// dotenv.config();
// connectDB();
// const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.json());



// const io=new Server (app,{
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         credentials: true,
//     },
// })


// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })
// app.use('/user', userRoutes);
// app.use('/message',messageRoutes)
// app.use('/chat',chatRoutes)

// const connectedUser={};
// io.on('connection',(socket)=>{
//     console.log('User connected:', socket.id);

//     socket.on("join",({userId,role})=>{
//         socket.userId=userId;
//         socket.role=role;
//         connectedUser[userId]=socket.id;
//         console.log(`User ${userId} with role ${role} joined with socket ID: ${socket.id}`);    
//     })
//     socket.on("disconnect",()=>{
//         console.log('User disconnected:', socket.id);
//         if (socket.userId) {
//             delete connectedUser[socket.userId];
//             console.log(`User ${socket.userId} disconnected`);
//         }
//     })
// })



// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // ✅ use HTTP server
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

// ✅ Create HTTP server manually
const server = http.createServer(app);

// ✅ Attach socket.io to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// ✅ Connected users map
const connectedUser = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on("join", ({ userId, role }) => {
        socket.userId = userId;
        socket.role = role;
        connectedUser[userId] = socket.id;
        console.log(`User ${userId} with role ${role} joined with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId) {
            delete connectedUser[socket.userId];
            console.log(`User ${socket.userId} disconnected`);
        }
    });
});

// ✅ Start the HTTP server (not app.listen)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io, connectedUser };
// Exporting io and connectedUser for use in other modules
// This allows other parts of your application to access the socket.io instance and connected users map.