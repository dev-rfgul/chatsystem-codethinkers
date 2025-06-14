import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const userSchema = new mongoose.Schema({
    uuid: { type: String, default: uuid },
    name: String,
    email: { type: String, unique: true, },
    password: String,
    isAdmin: { type: Boolean, default: false },
    message:[
        {
            message:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Message"
            }
        }
    ]
})
const User = mongoose.model('User', userSchema);
export default User;