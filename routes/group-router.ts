import * as express from 'express';
import {User} from "../models/user";
const groupRouter = express.Router();
const {Group} = require('../models/group');

groupRouter.get('/', async(req,res)=>{
    try {
        if (req.query["groups_with_children"] == "true") {
            const groups = await walkGroups(await Group.findOne({name: "root"}));
            // fixme;

            res.status(200).json(groups);
        }
        else {
            res.status(200).json(await Group.find({}, {__v: 0}));
        }
    }
    catch (e) {
        throw new Error("Fetch groups failed");
    }
});

groupRouter.get("", async(req,res)=>{
    try{

    }
    catch (e) {
        throw new Error();
    }

});

groupRouter.post('/', (req,res)=>{
    const group = req.body;
    const newGroup = new Group({name:group.name, parentId:group.parentId});
    newGroup.save().then(()=>{
        if(group.parentId){
            Group.findByIdAndUpdate(group.parentId, {$addToSet:{children:[{kind:'Group', childId:newGroup._id}]}},{new:true})
                .then(()=>{
                    res.status(201).send(newGroup);
                })

            // Group.findById(group.parentId)
            //     .then((parentGroup) => {
            //         parentGroup.children.push({kind:'Group', childId:newGroup._id });
            //
            //         parentGroup.save()
            //             .then(()=>{
            //                 res.status(201).send(newGroup);
            //             });
            //     })
        }
        else{
            res.status(201).json(newGroup);
        }
    }).catch((err)=>{
        //throw new Error("");
        res.send(err)
    })
});

groupRouter.patch('/:id', (req,res)=>{
    Group.findByIdAndUpdate(req.params.id, { name: req.body.name },{new:true})
        .then((updatedGroup)=>{
            res.status(200).json(updatedGroup);
    })
});

groupRouter.delete('/:id', async (req,res)=>{
    try {
        const groupToDelete = await Group.findById(req.params.id);
        const groupsToDelete = await walkGroups(groupToDelete);
        const groupsToDeleteIds = groupsToDelete.map((group)=>{
            return group._id;
        });
        await Group.deleteMany({ _id: { $in: groupsToDeleteIds } });
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete group failed");
    }
});

groupRouter.post('/:id/users', async(req, res)=>{
    try {
        const selectedUser = await User.findById(req.body.id);
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, {$addToSet:{children:[{kind:'User', childId:selectedUser._id}]}},{new:true});
        res.status(200).json(updatedGroup);
    }
    catch (e) {
        throw new Error("Add user to group failed");
    }

});

groupRouter.delete('/:id/users/:userid', async(req, res)=>{
    try {
        const selectedUser = await User.findById(req.params.userid);
        await Group.findByIdAndUpdate(req.params.id, {$pull: {children: {childId: selectedUser._id}}});
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete user from group failed");
    }
});

async function walkGroups(selectedGroup){
    const groups = [selectedGroup];
    if(selectedGroup.checkForGroupChildren()){
        const groupFullData = await selectedGroup.populate('children.childId');
        const promises = groupFullData.children.map(async(groupChild)=>{
                            const group = await Group.findById(groupChild.childId._id);
                            groups.push(...await walkGroups(group));
        });
        await Promise.all(promises);
    }
    return groups;
}


export default groupRouter;