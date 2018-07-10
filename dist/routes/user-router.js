"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const userRouter = express.Router();
const user_1 = require("../models/user");
userRouter.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const users = yield user_1.User.find({}, { password: 0, __v: 0 });
        //return await ...
        res.status(200).json(users);
    }
    catch (e) {
        throw new Error("fetch users failed");
    }
}));
userRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const userDetails = req.body;
        const newUser = yield new user_1.User(userDetails);
        // hash the password;
        yield newUser.save();
        res.status(201).json({ id: newUser._id, name: newUser["name"], age: newUser["age"] });
    }
    catch (e) {
        throw new Error("create user failed");
    }
}));
userRouter.patch('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const newDetails = req.body;
        const newAge = newDetails.age;
        const newPassword = newDetails.password;
        const user = yield user_1.User.findById(req.params.id);
        if (newAge) {
            user["age"] = newAge;
        }
        if (newPassword) {
            user["password"] = newPassword;
        }
        const updateUser = yield user.save();
        res.status(200).json({ id: updateUser._id, name: updateUser["name"], age: updateUser["age"] });
    }
    catch (e) {
        throw new Error("Update user failed");
    }
}));
userRouter.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield user_1.User.findByIdAndRemove(req.params.id);
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete user failed");
    }
}));
exports.default = userRouter;
//# sourceMappingURL=user-router.js.map