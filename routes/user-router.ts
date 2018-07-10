import * as express from 'express';
const userRouter = express.Router();
import {User} from '../models/user';

userRouter.get('/', async(req,res)=>{
    try{
        const users = await User.find({}, {password:0, __v:0});
        //return await ...
        res.status(200).json(users);
    }
    catch (e) {
        throw new Error("fetch users failed");
    }
});

userRouter.post('/', async (req,res)=>{
    try {
        const userDetails = req.body;
        const newUser = await new User(userDetails);
        // hash the password;
        await newUser.save();
        res.status(201).json({id: newUser._id, name: newUser["name"], age: newUser["age"]});
    }
    catch (e) {
        throw new Error("create user failed");
    }
});

userRouter.patch('/:id', async (req,res)=>{
    try {
        const newDetails = req.body;
        const newAge = newDetails.age;
        const newPassword = newDetails.password;
        const user = await User.findById(req.params.id);
        if (newAge) {
            user["age"] = newAge;
        }
        if (newPassword) {
            user["password"] = newPassword;
        }
        const updateUser = await user.save();

        res.status(200).json({id:updateUser._id, name:updateUser["name"], age:updateUser["age"]});
    }
    catch (e) {
        throw new Error("Update user failed")
    }
});


userRouter.delete('/:id', async(req,res)=>{
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete user failed");
    }
});

export default userRouter;