const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (query) => {
  router.get("/users", (req, res) => {
    query.getUsers()
      .then(users => res.json(users))
  });

  router.put("/users/new", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        console.log(err);
      }
      else {
        req.body.password = hashedPassword;
        query.createUser(name, email, hashedPassword)
          .then(user => res.json(user))
          .catch(error => console.log(error));
      }
    })

  });

  return router
}