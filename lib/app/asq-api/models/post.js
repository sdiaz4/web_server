const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: false,
        trim: true,
        minLenght: 10,
        maxLenght: 100
    },
    contents: { type: String, required: true,
        trim: true,
        minLenght: 1,
        maxLenght: 1000
    },
    author: { type: String, required: true,
        match: /^[a-zA-Z][a-zA-Z\d]*$/,
        minLenght: 4,
        maxLenght: 20
    },
    reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false},
    likeCount: { type: Number, required: true, default: 0 },
    created: { type: Date, required: true, default: Date.now },
    edited: { type: Date, required: true, default: Date.now }


});

const Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;