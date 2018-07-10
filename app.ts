import * as mongoose from 'mongoose';
import * as express from 'express';
import userRouter from './routes/user-router';
import groupRouter from './routes/group-router';
import messageRouter from './routes/message-router';

const app = express();
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });

app.use(express.json());

app.use('/users', userRouter);
app.use('/groups', groupRouter);
app.use('/messages', messageRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));