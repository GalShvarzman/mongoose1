import * as mongoose from 'mongoose';
import {messageSchema} from './message';

const conversationSchema = new mongoose.Schema({
   conversationId : String,
   messages : [messageSchema]
});

export const Conversation = mongoose.model('Conversation', conversationSchema);