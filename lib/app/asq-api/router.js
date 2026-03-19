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
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
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
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }

});

router.get('/questions/:questionid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.questionid);
        if (!post || post.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Question not found' });
        }
        const postObj = post.toObject();
        delete postObj.__v;
        delete postObj.reference;
        res.json(postObj);
    }
    catch (err) {
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }
});

router.put('/questions/:questionid', async (req, res) => {
    try {
        const post = await Post.findById(req.params.questionid);
        if (!post || post.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Question not found' });
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
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }
});

router.get('/questions/:questionid/answers', async (req, res) => {
    try {
        const question = await Post.findById(req.params.questionid );
        if (!question || question.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Question not found' });
        }
        const answers = await Post.find({ reference: req.params.questionid }).select( '-title' );
        res.json(answers);
    }
    catch (err) {
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }
});

router.post('/questions/:questionid/answers', async (req, res) => {
    const date = new Date();

    try {
        const question = await Post.findById(req.params.questionid);
        if (!question || question.reference !== undefined) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Question not found' });
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
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }
});

router.get('/answers/:answerid', async (req, res) => {
    try {
    const post = await Post.findById(req.params.answerid).select( '-title' );
    if (!post || post.reference === undefined) {
        return res.status(404).json({ code: 'NOT_FOUND', message: 'Answer not found' });
    }
    const postObj = post.toObject();
    delete postObj.__v;
    res.json(postObj);
    }
    catch (err) {
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "unexpected error occurred"
        });
    }
});

router.put('/answers/:answerid', (req, res) => {

});

router.get('/likes/:postid', (req, res) => {
});

router.get('/likes/:postid/:username', (req, res) => {
}); 

router.post('/likes/:postid/:username', (req, res) => {
});

router.delete('/likes/:postid/:username', (req, res) => {
});




module.exports = {
    router
}