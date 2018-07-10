"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
exports.messageSchema = new mongoose.Schema({
    message: String,
    date: Date,
    sender: {
        type: ObjectId,
        ref: 'User'
    }
});
exports.Message = mongoose.model('Message', exports.messageSchema);
//# sourceMappingURL=message.js.map