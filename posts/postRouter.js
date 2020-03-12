const express = require('express');
const postDb = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  // Get posts
  postDb.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err=> {
      res.status(500).json({message: 'There was an error retrieving posts'});
    });
});

router.get('/:id', validatePostId, (req, res) => {
  // Get post by id
  const postId = req.params.id;
  postDb.getById(postId)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'There was an error retrieving the Post'});
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  // Delete post
  postDb.remove(req.params.id)
    .then(post => {
      res.status(200).json({message: `Post: ${req.params.id} Deleted`});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "There was an error Deleting the post"});
    });
});

router.put('/:id', validatePostId, (req, res) => {
  // Update post
  const body = req.body
  const id = req.params.id
  if(body.text){
    postDb.update(id, body)
      .then(post => {
        res.status(201).json({message: `Post updated`, post})
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({message: 'There was an error updating the post'});
      });
  }else{
    res.status(400).json({message: 'Please provide the required text and post Id'});
  }
  
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  postDb.getById(req.params.id)
    .then(post => {
      if(post){
        next();
      }else{
        res.status(400).json({message: "Invalid post Id"})
      }
    })
}

module.exports = router;
