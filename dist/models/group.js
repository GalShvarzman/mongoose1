"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const groupSchema = new mongoose.Schema({
    name: String,
    parentId: {
        type: ObjectId,
        ref: 'Group'
    },
    children: [{
            _id: false,
            kind: String,
            childId: {
                type: ObjectId,
                refPath: 'children.kind'
            }
        }]
});
groupSchema.methods = {
    checkForGroupChildren() {
        return (this.children.length > 0 && this.children[0].kind === "Group");
    }
};
// function autoPopulateGroupChildren(next) {
//     this.populate('groupChildren.item');
//     next();
// }
//
// groupSchema.pre('findOne', autoPopulateGroupChildren);
exports.Group = mongoose.model('Group', groupSchema);
//# sourceMappingURL=group.js.map