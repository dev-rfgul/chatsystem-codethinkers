import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
const app = express();

dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use('/user', userRoutes);
app.use('/message',messageRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})