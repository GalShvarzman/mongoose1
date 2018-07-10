"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const message_1 = require("./message");
const conversationSchema = new mongoose.Schema({
    conversationId: String,
    messages: [message_1.messageSchema]
});
exports.Conversation = mongoose.model('Conversation', conversationSchema);
//# sourceMappingURL=conversation.js.map