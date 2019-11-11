const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyID,
  secretAccessKey: process.env.AWSSecretAccessKey
});
s3 = new AWS.S3();



module.exports = (query) => {

  router.get("/files", (req, res) => {
    query.getFiles()
      .then(files => res.json(files))
  });

  router.get("/users", (req, res) => {
    query.getUsers()
      .then(users => res.json(users))
  });

  router.get("/categories", (req, res) => {
    query.getCategories()
      .then(categories => res.json(categories))
  });

  router.get("/user/categories", (req, res) => {
    query.getCategoriesByUserEmail(req.body.email)
      .then(categories => res.json(categories))
  });

  router.put("/users/create/category", (req, res) => {
    const categoryName = req.body.name
    const email = req.body.email
    const acct_id = req.body.acct_id
    query.getFilesByUserEmail(email)
      .then(file => {
        query.getCategoryByNameAndUserID(categoryName, file[0].user_id)
          .then(category => {
            if (!category[0]) {
              query.createCategory(categoryName, file[0].id, acct_id, file[0].user_id)
                .then(category => res.json(category))
                .catch(error => console.log(error));

              let params = {
                Bucket: process.env.AWSS3_BUCKET,
                Key: email + '/' + categoryName + '/'
              };
              s3.putObject(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
              });
            }
            else {
              res.send(`${categoryName} is already created :)`);
            }
          })
      })
      .catch(error => console.log(error));
  })

  router.put("/users/register", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    query.getUserByEmail(email)
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
            if (err) {
              console.log(err);
            }
            else {
              req.body.password = hashedPassword;
              let params = {
                Bucket: process.env.AWSS3_BUCKET,
                Key: email + '/'
              };
              s3.putObject(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
              });
              query.createUser(name, email, hashedPassword)
                .then(user => {
                  query.createUserFile(email, user[0].id)
                    .then(res.json(user))
                })
                .catch(error => console.log(error));
            }
          })
        }
        else {
          res.send(`${user.email} is already registered :)`);
        }
      })
  });

  return router
}