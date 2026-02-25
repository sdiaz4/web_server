const express = require('express');
const router = express.Router();

function gameInfo(req, res, next) {
    if (!req.session.secret) {
        req.session.secret = 40; //Math.floor(Math.random() * 100) + 1;
        req.session.guesses = [];
        req.session.state = false;
        req.session.isNaN = false;
        req.session.higher = false;
        req.session.lower = false;
    }
    next();
}



router.get('/play', (req, res) => {
    const data = {
        guesses: req.session.guesses,
        state: req.session.state,
        stateText: req.session.state,
        invalidGuess: req.session.isNaN,
        higher: req.session.higher,
        lower: req.session.lower
    }

    res.render('secret', data);   
});



router.post('/guess', (req, res) => {
    const guess = parseInt(req.body.guess);

    if (isNaN(guess) || guess === undefined || guess =='') {
        req.session.isNaN = true;
    }
    else if (guess < req.session.secret) {
        req.session.lower = true;
    }
    else if (guess > req.session.secret) {
        req.session.higher = true;
    }
    else {
        req.session.state = true;
    }

    res.redirect(303, '/secret/play')
});

router.post('/reset', (req, res) => {
    req.session.destroy();
    res.redirect(303, '/secret/play');
});





module.exports = {
    router
}