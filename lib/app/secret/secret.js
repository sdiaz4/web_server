const express = require('express');
const router = express.Router();

function game(req, res, next) {
    if (!req.session.secret) {
        req.session.secret = 40; //Math.floor(Math.random() * 100) + 1;
        req.session.guesses = [];
        req.session.state = false;
        req.session.isNaN = false;
    }
    next();
}



router.get('/play', (req, res) => {

     if (req.session.isNaN) {
        let invalidGuess = req.session.isNaN
        req.session.isNaN = false;
    }
    else if (req.session.state) {
        
    }
    
    res.render('secret.hbs', {
        guesses: req.session.guesses,
        state: req.session.state,
        guessLength: req.session.guesses.length,
        stateText: req.session.state ? "You Win!" : "Keep Guessing!",
        invalidGuess: invalidGuess
    });

});



router.post('/guess', (req, res) => {
    const guess = parseInt(req.body.guess);
    if (isNaN(guess)) {
        req.session.isNaN = true;
    }
    else {
        req.session.isNaN = false;
        if (guess === req.session.secret) {
            req.session.state = true;
        }
        req.session.guesses.push(guess)
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