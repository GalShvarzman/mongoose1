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
const user_1 = require("../models/user");
const groupRouter = express.Router();
const { Group } = require('../models/group');
groupRouter.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (req.query["groups_with_children"] == "true") {
            const groups = yield walkGroups(yield Group.findOne({ name: "root" }));
            groups;
            res.status(200).json(groups);
        }
        else {
            res.status(200).json(yield Group.find({}, { __v: 0 }));
        }
    }
    catch (e) {
        throw new Error("Fetch groups failed");
    }
}));
groupRouter.get("", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
    }
    catch (e) {
        throw new Error();
    }
}));
groupRouter.post('/', (req, res) => {
    const group = req.body;
    const newGroup = new Group({ name: group.name, parentId: group.parentId });
    newGroup.save().then(() => {
        if (group.parentId) {
            Group.findByIdAndUpdate(group.parentId, { $addToSet: { children: [{ kind: 'Group', childId: newGroup._id }] } }, { new: true })
                .then(() => {
                res.status(201).send(newGroup);
            });
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
        else {
            res.status(201).json(newGroup);
        }
    }).catch((err) => {
        //throw new Error("");
        res.send(err);
    });
});
groupRouter.patch('/:id', (req, res) => {
    Group.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
        .then((updatedGroup) => {
        res.status(200).json(updatedGroup);
    });
});
groupRouter.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const groupToDelete = yield Group.findById(req.params.id);
        const groupsToDelete = yield walkGroups(groupToDelete);
        const groupsToDeleteIds = groupsToDelete.map((group) => {
            return group._id;
        });
        yield Group.deleteMany({ _id: { $in: groupsToDeleteIds } });
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete group failed");
    }
}));
groupRouter.post('/:id/users', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const selectedUser = yield user_1.User.findById(req.body.id);
        const updatedGroup = yield Group.findByIdAndUpdate(req.params.id, { $addToSet: { children: [{ kind: 'User', childId: selectedUser._id }] } }, { new: true });
        res.status(200).json(updatedGroup);
    }
    catch (e) {
        throw new Error("Add user to group failed");
    }
}));
groupRouter.delete('/:id/users/:userid', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const selectedUser = yield user_1.User.findById(req.params.userid);
        yield Group.findByIdAndUpdate(req.params.id, { $pull: { children: { childId: selectedUser._id } } });
        res.status(204).send("");
    }
    catch (e) {
        throw new Error("Delete user from group failed");
    }
}));
function walkGroups(selectedGroup) {
    return __awaiter(this, void 0, void 0, function* () {
        const groups = [selectedGroup];
        if (selectedGroup.checkForGroupChildren()) {
            const groupFullData = yield selectedGroup.populate('children.childId');
            const promises = groupFullData.children.map((groupChild) => __awaiter(this, void 0, void 0, function* () {
                const group = yield Group.findById(groupChild.childId._id);
                groups.push(...yield walkGroups(group));
            }));
            yield Promise.all(promises);
        }
        return groups;
    });
}
exports.default = groupRouter;
//# sourceMappingURL=group-router.js.map