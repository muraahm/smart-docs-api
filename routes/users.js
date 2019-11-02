const express = require('express');
const router = express.Router();

module.exports = (query) => {
  router.get("/users", (req, res) => {
    query.getUsers()
      .then(users => res.json(users))
  });
  
  return router
}