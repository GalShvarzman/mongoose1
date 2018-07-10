import * as mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

export const messageSchema = new mongoose.Schema({
    message:String,
    date:Date,
    sender:{
        type: ObjectId,
        ref: 'User'
    }
});

export const Message = mongoose.model('Message', messageSchema);