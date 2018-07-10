import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        index: true,
        unique: true
    },
    age:Number,
    password:String
});

export const User = mongoose.model('User', userSchema);