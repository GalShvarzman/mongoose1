"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const express = require("express");
const user_router_1 = require("./routes/user-router");
const group_router_1 = require("./routes/group-router");
const message_router_1 = require("./routes/message-router");
const app = express();
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });
app.use(express.json());
app.use('/users', user_router_1.default);
app.use('/groups', group_router_1.default);
app.use('/messages', message_router_1.default);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
//# sourceMappingURL=app.js.map