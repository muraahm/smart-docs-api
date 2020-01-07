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

const jwt = require('jsonwebtoken')



module.exports = (query) => {

  router.put("/accountant/register", (req, res) => {
    const name = req.body.name
    const company = req.body.accountantCompany
    const email = req.body.email

    query.getAccountantByEmail(email)
      .then(accountant => {
        if (!accountant) {
          bcrypt.hash(req.body.password,
            saltRounds, function (err, hashedPassword) {
              if (err) {
                console.log(err);
              }
              else {
                req.body.password = hashedPassword;
                query.createAccountant(name, company, email, hashedPassword)
                  .then(accountant => {
                    jwt.sign({
                      id: accountant[0].id,
                      name: name,
                      email: email
                    },
                      'secretkey', { expiresIn: 1800 }, (err, token) => { //generate token and expires in 30min
                        res.json({
                          id: accountant[0].id,
                          name: name,
                          company: company,
                          email: email,
                          token: token
                        })
                      })

                  })
                  .catch(error => console.log(error));
              }
            })
        }
        else {
          res.send({ meassage: `Try again: ${email} is already registered.` });
        }
      })
  });


  const checkAccountantPassword = function (email, password) {
    return (query.getAccountantByEmail(email))
      .then(accountant => {
        if (accountant !== null) {
          if (bcrypt.compareSync(password, accountant.password)) {
            return accountant
          }
        } else {
          return null;
        }
      })
      .catch(error => console.log(error));
  };

  router.post("/accountant/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    checkAccountantPassword(email, password)
      .then(accountant => {
        if (!accountant) { res.send({ meassage: `Try again: Wrong email or password.` }) }
        if (accountant) {
          query.getUsersCategoriesByAccountantEmail(accountant.email)
            .then(usersAndCategories => {
              jwt.sign({
                id: accountant.id,
                name: accountant.name,
                company: accountant.company,
                email: accountant.email,
                users: usersAndCategories
              },
                'secretkey', { expiresIn: 1800 }, (err, token) => { //generate token and expires in 30min
                  res.json({
                    id: accountant.id,
                    name: accountant.name,
                    company: accountant.company,
                    email: accountant.email,
                    users: usersAndCategories,
                    token
                  })
                })
            })

        }
      }
      )
  });

  router.post('/accountant', function (req, res) {
    var token = req.body.token;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, 'secretkey', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      query.getUsersCategoriesByAccountantEmail(decoded.email)
        .then(usersAndCategories => {
          query.getAccountantByEmail(decoded.email)
            .then(accountant => {

              res.json({
                id: accountant.id,
                name: accountant.name,
                company: accountant.company,
                email: accountant.email,
                users: usersAndCategories
              })
            })
        })
    });
  });










  return router
}