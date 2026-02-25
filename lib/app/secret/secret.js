const express = require('express');
const router = express.Router();
const config = require('../../config.js');

const path = require('path');
router.get('/play.css', (req, res) => {
    res.sendFile(config.projectPath('static', 'play.css'));
});

function gameInfo(req, res, next) {
    if (!req.session.secret) {
        req.session.secret = Math.floor(Math.random() * 100) + 1;
        req.session.guesses = [];
        req.session.state = false;
        req.session.isNaN = false;
        req.session.count = 0;
    }
    next();
}

router.use(gameInfo);



router.post('/guess', (req, res) => {
    req.session.isNaN = false;
   

    //gets number from post
    const raw = req.body.guess;
    const guess = parseInt(raw);
    //checks if input is debug
    if (raw === 'mode=debug') {
        req.session.debug = true;
    }
    else if (isNaN(guess) || guess === undefined || guess == '') { //checks if is number
            req.session.isNaN = true;
        }
    else {
        if (guess < req.session.secret) {
            req.session.guesses.push({guess: guess, status: 'low', message: 'too low'});
        }
        else if (guess > req.session.secret) {
            req.session.guesses.push({guess: guess, status: 'high', message: 'too high'});
        }
        else if (guess == req.session.secret) {
            req.session.state = true;
            req.session.guesses.push({guess: guess, status: 'correct', message: 'correct'});
        }
        req.session.count++;
    }
    req.session.save(() => {
        res.redirect(303, 'play');
    });
});
    
    


router.get('/play', (req, res) => {
        const debug = req.query.mode === 'debug';

    const data = {
        guesses: [...req.session.guesses].reverse(),
        state: req.session.state,
        stateText: req.session.state,
        invalidGuess: req.session.isNaN,
        debug: debug,
        secret: req.session.secret,
        count: req.session.count
    }

    res.render('secret', data);   
});


router.post('/reset', (req, res) => {
    req.session.secret = Math.floor(Math.random() * 100) + 1;
    req.session.guesses = [];
    req.session.state = false;
    req.session.count = 0;
    req.session.isNaN = false;
    req.session.save(() => {
        res.redirect(303, 'play');
    });
});


module.exports = {
    router
}