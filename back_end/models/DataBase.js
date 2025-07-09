import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCommentModel } from "./Comment.js";
import { createModel as createCommentVoteModel } from "./CommentVote.js";
import { createModel as createMemeVoteModel } from "./MemeVote.js";
import { createModel as createMemeModel } from "./Meme.js";
import { createModel as createTagModel } from "./Tag.js";
import { init } from "./init_data.js";
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



// Associazioni User
User.Memes = User.hasMany(Meme, { onDelete: 'CASCADE' });
User.MemeVotes = User.hasMany(MemeVote, { onDelete: 'CASCADE' });
User.CommentVotes = User.hasMany(CommentVote, { onDelete: 'CASCADE' });
User.Comments = User.hasMany(Comment, { onDelete: 'CASCADE' });

// Associazioni Meme
Meme.MemeVotes = Meme.hasMany(MemeVote, { onDelete: 'CASCADE' });
Meme.Comments = Meme.hasMany(Comment, { onDelete: 'CASCADE' });
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



database.sync({ /*alter: true*/ }).then(() => {
    console.log("Database synced correctly");
    if (process.env.INIT_DATA == "true") {
        init().catch(() => {
            console.log("[!] dati gia inseriti");
        });
    }
}).catch(err => {
    console.log("Error with database synchronization: " + err.message);
});



