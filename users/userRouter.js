const express = require("express");
const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  //Create new user
  userDb
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error creating user." });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  // Create new post
  postDb
    .insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error creating the post" });
    });
});

router.get("/", (req, res) => {
  // Get users
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "There was an error retrieving users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // Get users by id
  userDb
    .getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was and error." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // Get post by user id
  userDb
    .getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error retrieving posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // Delete user
  userDb
    .remove(req.params.id)
    .then(post => {
      res.status(200).json({ message: `User: ${req.params.id} Deleted` });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error Deleting the post" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // Update user
  const body = req.body;
  const id = req.params.id;
  if (body.name) {
    userDb
      .update(id, body)
      .then(user => {
        res.status(201).json({ message: `Post updated`, user });
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ message: "There was an error updating the user" });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide the required name and user Id" });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  userDb.getById(req.params.id).then(id => {
    if (id) {
      next();
    } else {
      res.status(400).json({ message: "Invalid user Id" });
    }
  });
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "Missing required user information" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body.text) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
