const PublicationDraft = require('./publication_draft');
const User = require('./user');
const Publication = require('./publication');
const Comment = require('./comment');
const Message = require('./message');

// Drafts
User.hasMany(PublicationDraft, {
    foreignKey: 'userId'
});
//PublicationDraft.belongsTo(User);

// Publications
Publication.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Comment.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Comment.belongsTo(Publication, {
    foreignKey: 'publicationId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Message.belongsTo(User, {
    foreignKey: 'fromUserId',
    as: 'sourceUser'
});

Message.belongsTo(User, {
    foreignKey: 'toUserId',
    as: 'targetUser'
});

// Exports
exports.PublicationDraft = PublicationDraft;
exports.User = User;
exports.Publication = Publication;
exports.Comment = Comment;
exports.Message = Message;