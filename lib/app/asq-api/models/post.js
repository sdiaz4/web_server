const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: false,
        trim: true,
        minLength: 10,
        maxLength: 100
    },
    contents: { type: String, required: true,
        trim: true,
        minLength: 1,
        maxLength: 1000
    },
    author: { type: String, required: true,
        match: /^[a-zA-Z][a-zA-Z\d]*$/,
        minLength: 4,
        maxLength: 20
    },
    reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false},
    likeCount: { type: Number, required: true, default: 0 },
    created: { type: Date, required: true, default: Date.now },
    edited: { type: Date, required: true, default: Date.now }


});

const Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;