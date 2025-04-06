import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    reservationsHistory: {
        type: [{
            movie: {
                type: Schema.Types.ObjectId,
                ref: 'Movie'
            },
            date: {
                type: Date,
                required: true
            }
        }],
        default: []
    }
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await compare(enteredPassword, this.password);
};

export default model('User', userSchema);
