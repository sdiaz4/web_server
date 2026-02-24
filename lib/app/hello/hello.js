const express = require('express');



function helloWorld(req, res , next) {
    let count = req.session.count || 0;
    ++count;
    req.session.count = count;


    res.status(200);
    res.type('text/html'); 
    res.send(`<html>
        <h1>Hello, world!</h1>
        <p>You have been to this page ${count} time(s).</p>
        </html>
        `);
}

const router = express.Router();

router.get('/hello', helloWorld);

module.exports = {
    router
}