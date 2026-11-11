# ASQ API Web Server

A Node.js and Express web server built for COMP 4310. Its main feature is the **ASQ API**, a REST API for a question-and-answer site ("Ask, Share, Question") that stores questions, answers and likes in MongoDB. The same server also hosts a small static site, a number-guessing game that uses sessions, and JWT-protected user pages.

## Features

### ASQ REST API (`/asq/api`)

Questions and answers are both stored as `Post` documents. An answer's `reference` field points to the question it answers; a question has no `reference`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/questions` | List all questions (without their full contents). |
| `POST` | `/questions` | Create a question (`title`, `contents`, `author`). |
| `GET` | `/questions/:questionid` | Get one question. |
| `PUT` | `/questions/:questionid` | Edit a question's title or contents. |
| `GET` | `/questions/:questionid/answers` | List a question's answers. |
| `POST` | `/questions/:questionid/answers` | Add an answer (`contents`, `author`). |
| `GET` | `/answers/:answerid` | Get one answer. |
| `PUT` | `/answers/:answerid` | Edit an answer's contents. |
| `GET` | `/likes/:postid` | List the usernames that liked a post. |
| `GET` | `/likes/:postid/:username` | `true` or `false`: has this user liked the post? |
| `POST` | `/likes/:postid/:username` | Like a post. Liking twice has no extra effect. |
| `DELETE` | `/likes/:postid/:username` | Remove a like. |

Errors come back as JSON with a `code` and a `message`:

| Status | Code | When |
| --- | --- | --- |
| 400 | `INVALID_PARAMS` | The data fails validation (see below). |
| 400 | `INVALID_JSON` | The request body isn't valid JSON. |
| 404 | `NOT_FOUND` | The ID is malformed or doesn't exist. |
| 405 | `UNSUPPORTED` | The HTTP method isn't supported for that URL. |
| 500 | `INTERNAL` | Any unexpected server error. |

**Validation** (Mongoose schemas in `lib/app/asq-api/models/`):

- Titles are 10–100 characters; contents are 1–1000 characters.
- Authors and usernames are 4–20 characters, start with a letter, and contain only letters and digits.
- A unique index on `(post, user)` means each user can like a post only once. Each post's `likeCount` is kept up to date as likes are added and removed.

### Secret number game (`/secret/play`)

A guessing game for a number from 1 to 100, kept in the user's session. Each guess is marked too low, too high or correct, and the page shows the history of guesses and how many were needed. Adding `?mode=debug` to the URL reveals the secret number. Pages are rendered with Handlebars (`views/secret.hbs`).

### Static site and protected pages

- `/` serves a home page with links to the game and a bison photo page (`static/`).
- Everything under `/users` requires a valid JWT in an `Authorization: Bearer` header, verified against the public key `tas.pub.pem` with issuer `taz.harding.edu`.
- `/users/admin` also requires the token's `roles` to include `admin`. Otherwise it returns 403.

## Project structure

```
lib/
  server.js               Connects to MongoDB, then starts the HTTP server on port 8000
  config.js               Port, log level, paths, session secret and database settings
  db.js                   Mongoose connect/disconnect
  logger.js               Winston logger (HTTP request logs come from Morgan)
  app/
    app.js                Express app: middleware, JWT authentication, sessions, routes
    common.js             404 handler
    asq-api/router.js     ASQ API routes
    asq-api/models/       Post and Like Mongoose schemas
    secret/secret.js      Number-guessing game routes
    hello/hello.js        Session visit-counter example (not currently mounted)
  keys/tas.pub.pem        Public key for verifying JWTs
static/                   Static HTML, CSS and images, plus the protected users JSON files
views/secret.hbs          Handlebars template for the game
test/app/asq-api.test.http  Manual API requests (for the VS Code REST Client)
```

## Running it

Requires Node.js and MongoDB.

```
npm install
npm run startdb      # starts MongoDB with its data stored in lib/db
npm start            # starts the server at http://localhost:8000
npm run start:watch  # same, but restarts automatically when files change (nodemon)
```

The server connects to the `asq` database on `localhost`.

**Environment variables (all optional):**

| Variable | Purpose | Default |
| --- | --- | --- |
| `LOG_LEVEL` | Winston log level | `debug` |
| `MORGAN_FORMAT` | Morgan request-log format | `dev` |
| `SESSION_SECRET` | Secret used to sign session cookies | `default_secret` |

## Built with

Express 5, Mongoose 9, express-session with session-file-store, express-handlebars, jsonwebtoken, Winston and Morgan.

## Project notes

- **Author:** Simon Diaz
- **Description:** ASQ API: an API for working with the question-and-answer database.
- **External sources:** None. The requests in `test/app/asq-api.test.http` were generated with AI.
- **Weaknesses:** Time management and understanding sessions.
- **Strengths:** Debugging skills and knowledge gained on the subject.
