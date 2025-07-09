import { database, User, Meme, Tag, MemeVote, Comment, CommentVote } from '../models/DataBase.js';

export async function init() {

    // Inserimento utenti
    await User.bulkCreate([
        { nickName: 'alice', email: 'alice@example.com', profilePic: 'https://storage.googleapis.com/meme_bucket_pg/FeKh4w9zlViVYDNrIX2Iv', password: 'passwordhash1', createdAt: new Date(), updatedAt: new Date() },
        { nickName: 'bob', email: 'bob@example.com', profilePic: 'https://storage.googleapis.com/meme_bucket_pg/AxXKPCuJ83wPzXBskKkKJ', password: 'passwordhash2', createdAt: new Date(), updatedAt: new Date() },
        { nickName: 'carol', email: 'carol@example.com', profilePic: 'https://storage.googleapis.com/meme_bucket_pg/PdHQMnR-xkrBq5WeyJrZi', password: 'passwordhash3', createdAt: new Date(), updatedAt: new Date() },
        { nickName: 'dave', email: 'dave@example.com', profilePic: 'https://storage.googleapis.com/meme_bucket_pg/PdHQMnR-xkrBq5WeyJrZi', password: 'passwordhash4', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Inserimento meme
    await Meme.bulkCreate([
        { image: 'https://storage.googleapis.com/meme_bucket_pg/FeKh4w9zlViVYDNrIX2Iv', description: 'Meme di Alice 1', UserIdUser: 1, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/AxXKPCuJ83wPzXBskKkKJ', description: 'Meme di Alice 2', UserIdUser: 1, createdAt: new Date(), updatedAt: new Date() },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/DWbS5eReleX2PxU5msWRr', description: 'Meme di Bob 1', UserIdUser: 2, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/b03VTImPFNfYjyLDxmkCR', description: 'Meme di Bob 2', UserIdUser: 2, createdAt: new Date(), updatedAt: new Date() },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/F74OQgeTVywhTVTzfoQ3e', description: 'Meme di Carol 1', UserIdUser: 3, createdAt: new Date(), updatedAt: new Date() },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/PdHQMnR-xkrBq5WeyJrZi', description: 'Meme di Carol 2', UserIdUser: 3, createdAt: new Date(), updatedAt: new Date() },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/PdHQMnR-xkrBq5WeyJrZi', description: 'Meme di Dave 1', UserIdUser: 4, createdAt: new Date(), updatedAt: new Date() },
        { image: 'https://storage.googleapis.com/meme_bucket_pg/b03VTImPFNfYjyLDxmkCR', description: 'Meme di Dave 2', UserIdUser: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Inserimento tag
    await Tag.bulkCreate([
        { name: 'gatti', createdAt: new Date(), updatedAt: new Date() },
        { name: 'cani', createdAt: new Date(), updatedAt: new Date() },
        { name: 'videogiochi', createdAt: new Date(), updatedAt: new Date() },
        { name: 'sport', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Associazione meme-tag
    await database.models.MemeTag.bulkCreate([
        { MemeIdMeme: 1, TagIdTag: 1 },
        { MemeIdMeme: 2, TagIdTag: 2 },
        { MemeIdMeme: 3, TagIdTag: 3 },
        { MemeIdMeme: 4, TagIdTag: 4 },
        { MemeIdMeme: 5, TagIdTag: 1 },
        { MemeIdMeme: 6, TagIdTag: 3 },
        { MemeIdMeme: 7, TagIdTag: 2 },
        { MemeIdMeme: 8, TagIdTag: 4 }
    ]);

    // Upvote/downvote casuali ai meme
    await MemeVote.bulkCreate([
        { upVote: true, UserIdUser: 2, MemeIdMeme: 1, createdAt: new Date(), updatedAt: new Date() },
        { upVote: false, UserIdUser: 3, MemeIdMeme: 1, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 1, MemeIdMeme: 3, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 4, MemeIdMeme: 2, createdAt: new Date(), updatedAt: new Date() },
        { upVote: false, UserIdUser: 2, MemeIdMeme: 4, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 3, MemeIdMeme: 5, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 1, MemeIdMeme: 6, createdAt: new Date(), updatedAt: new Date() },
        { upVote: false, UserIdUser: 4, MemeIdMeme: 7, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Inserimento commenti
    await Comment.bulkCreate([
        { content: 'Bellissimo meme!', MemeIdMeme: 1, UserIdUser: 3, createdAt: new Date(), updatedAt: new Date() },
        { content: 'Non mi piace molto', MemeIdMeme: 3, UserIdUser: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Upvote/downvote casuali ai commenti
    await CommentVote.bulkCreate([
        { upVote: true, UserIdUser: 2, CommentIdComment: 1, createdAt: new Date(), updatedAt: new Date() },
        { upVote: false, UserIdUser: 4, CommentIdComment: 1, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 3, CommentIdComment: 2, createdAt: new Date(), updatedAt: new Date() },
        { upVote: true, UserIdUser: 2, CommentIdComment: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);

    console.log('Seed completato!');
}