"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    age: Number,
    password: String
});
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map