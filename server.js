const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(helmet());
server.use(morgan());
server.use(express.json());
server.use(logger);

server.use('/api/users', userRouter);
server.use('/api/post', postRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method} Url: ${req.originalUrl} Time: ${Date.now()}`);

  next();
}

module.exports = server;
