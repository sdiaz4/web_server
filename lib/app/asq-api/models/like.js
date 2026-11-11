const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: { type: String, required: true,
        match: /^[a-zA-Z][a-zA-Z\d]*$/,
        minLength: 4,
        maxLength: 20
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema, 'likes');

module.exports = Like;