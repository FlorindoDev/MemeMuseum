import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCommentModel } from "./Comment.js";
import { createModel as createCommentVoteModel } from "./CommentVote.js";
import { createModel as createMemeVoteModel } from "./MemeVote.js";
import { createModel as createMemeModel } from "./Meme.js";
import { createModel as createTagModel } from "./Tag.js";
import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

createUserModel(database);
createCommentModel(database);
createCommentVoteModel(database);
createMemeModel(database);
createMemeVoteModel(database);
createTagModel(database);

export const {
    User,
    Comment,
    CommentVote,
    Meme,
    MemeVote,
    Tag
} = database.models;

//TODO aggiungere i delete on canscade del caso

// Associazioni User
User.Memes = User.hasMany(Meme);
User.MemeVotes = User.hasMany(MemeVote);
User.CommentVotes = User.hasMany(CommentVote);
User.Comments = User.hasMany(Comment);

// Associazioni Meme
Meme.MemeVotes = Meme.hasMany(MemeVote);
Meme.Comments = Meme.hasMany(Comment);
Meme.belongsToMany(Tag, { through: 'MemeTag' });
Meme.User = Meme.belongsTo(User);

// Associazioni MemeVote
MemeVote.User = MemeVote.belongsTo(User);
MemeVote.Meme = MemeVote.belongsTo(Meme);

// Associazioni CommentVote
CommentVote.User = CommentVote.belongsTo(User);
CommentVote.Comment = CommentVote.belongsTo(Comment, { onDelete: 'CASCADE' });

// Associazioni Comment
Comment.CommentVotes = Comment.hasMany(CommentVote);
Comment.User = Comment.belongsTo(User);
Comment.Meme = Comment.belongsTo(Meme);

// Associazioni Tag
Tag.belongsToMany(Meme, { through: 'MemeTag' });




//TODO: Controllare che sia il metodo giusto
database.sync({ alter: true }).then(() => {
    console.log("Database synced correctly");
}).catch(err => {
    console.log("Error with database synchronization: " + err.message);
});

