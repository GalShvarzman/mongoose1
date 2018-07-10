"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const messageRouter = express.Router();
const { Message } = require('../models/message');
const Conversation = require('../models/conversation');
messageRouter.get('/:id', (req, res) => {
    Conversation.findOne({ conversationId: req.params.id })
        .then((data) => {
        res.status(200).json(data);
    })
        .catch((err) => {
        res.status(500).send();
    });
});
messageRouter.get('/', (req, res) => {
    Conversation.find()
        .then((data) => {
        res.status(200).json(data);
    })
        .catch((err) => {
        res.status(500).send();
    });
});
messageRouter.post('/:id', (req, res) => {
    const message = req.body;
    const newMessage = new Message({ message: message.message, date: message.date, sender: message.sender });
    newMessage.save().then(() => {
        Conversation.findOne({ conversationId: req.params.id }).then((conversation) => {
            if (!conversation) {
                conversation = new Conversation({ conversationId: req.params.id, messages: [] });
                conversation.save().then(() => {
                    pushMessage(conversation, newMessage, res);
                });
            }
            else {
                pushMessage(conversation, newMessage, res);
            }
        });
    });
});
function pushMessage(conversation, newMessage, res) {
    conversation.messages.push(newMessage._id);
    conversation.save().then(() => {
        res.status(201).json(newMessage);
    });
}
exports.default = messageRouter;
//# sourceMappingURL=message-router.js.map