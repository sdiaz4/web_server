const express = require('express');
const router = express.Router();
const config = require('../../config.js');
const Like = require('./models/like');
const Post = require('./models/post');
const logger = require('../../logger.js');


router.get('/questions', async (req, res) => {
    try {
        const questions = await Post.find({ reference: undefined }).select( '-contents -reference -__v' );  
        res.json(questions);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            })
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
}
);

router.post('/questions', async(req, res) => {
    const date = new Date();

    const post = new Post({
        title: req.body.title,
        contents: req.body.contents,
        author: req.body.author,
        reference: undefined,
        likeCount: 0,
        created: date,
        edited: date
    });

    try {
        await post.save();
        const postObj = post.toObject();
        delete postObj.__v;
        res.json(postObj);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }

});

router.get('/questions/:questionid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.questionid);
        if (!post || post.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }
        const postObj = post.toObject();
        delete postObj.__v;
        delete postObj.reference;
        res.json(postObj);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.put('/questions/:questionid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.questionid);
        if (!post || post.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }

        if (req.body.title !== undefined) {
            post.title = req.body.title;
        }
        if (req.body.contents !== undefined) {
            post.contents = req.body.contents;
        }
        post.edited = new Date();
        await post.save();
        const postObj = post.toObject();
        delete postObj.__v;
        delete postObj.reference;
        res.json(postObj);
    }
    catch (err) {
       if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.get('/questions/:questionid/answers', async (req, res) => {
    try {
        const question = await Post.findById(req.params.questionid );
        if (!question || question.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }
        const answers = await Post.find({ reference: req.params.questionid }).select( '-title' );
        res.json(answers);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.post('/questions/:questionid/answers', async (req, res) => {
    const date = new Date();

    try {
        const question = await Post.findById(req.params.questionid);
        if (!question || question.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }
        const post = new Post({
            contents: req.body.contents,
            author: req.body.author,
            reference: req.params.questionid,
            likeCount: 0,
            created: date,
            edited: date
        });

    
        await post.save();
        const postObj = post.toObject();
        delete postObj.__v;
        res.json(postObj);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.get('/answers/:answerid', async (req, res) => {
    try {
    const post = await Post.findById(req.params.answerid).select( '-title' );
    if (!post || post.reference === undefined) {
        return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
    }
    const postObj = post.toObject();
    delete postObj.__v;
    res.json(postObj);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.put('/answers/:answerid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.answerid);
        if (!post || post.reference === undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }
        if (req.body.contents !== undefined) {
            post.contents = req.body.contents;
        }
        post.edited = new Date();

        await post.save();
        const postObj = post.toObject();
        delete postObj.__v;
        res.json(postObj);
     }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                code: "INVALID_PARAMS",
                message: err.message
            });
        }
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.get('/likes/:postid', async (req, res) => {
    try {
        const likes = await Like.find({ post: req.params.postid });
        const users = likes.map(like => like.user);
        res.json(users);
    }
    catch (err) {
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.get('/likes/:postid/:username', async (req, res) => {
    try {
        const like = await Like.findOne({ post: req.params.postid, user: req.params.username });
        if (like) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    catch (err) {
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }

});

router.post('/likes/:postid/:username', async(req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }
        const like = new Like({
            post: req.params.postid,
            user: req.params.username
        });

        try {
            await like.save();
            await Post.findOneAndUpdate({ _id: req.params.postid }, { $inc: { likeCount: 1 } });
        }
        catch (err) {
            if (err.name === 'MongoServerError' && err.code === 11000) {
            }
            else {
                throw err;
            }
        }
        res.json(true);
    }
    catch (err) {
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
});

router.delete('/likes/:postid/:username', async(req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Requested resource was not found' });
        }

        const like = await Like.deleteOne({ post: req.params.postid, user: req.params.username });

        if (like.deletedCount > 0) {
            await Post.updateOne({ _id: req.params.postid }, { $inc: { likeCount: -1 } });
        }
        res.json(true);
    }
    catch (err) {
        res.status(500).json({
            code: "INTERNAL",
            message: "The server encountered an unexpected error"
        });
    }
   
});




module.exports = {
    router
}