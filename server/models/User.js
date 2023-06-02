import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    lastName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    email: {
        type: String,
        min:2,
    },
    password: {
        type: String,
        min: 5
    },
    type: {
        type: String,
    }
}, {timestamps: true});

const User = mongoose.model('User',UserSchema);
export default User;