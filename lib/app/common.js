function notFound(req, res) {
    res.status(404);
    res.set('Content-Type', 'text/html');
    res.send(`<html>
        <h1>404 URL Not Found</h1>
        <p>The URL ${req.url} was not found.</p>
        </html>`);
}

module.exports = {
    notFound
}