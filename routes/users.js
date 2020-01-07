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

  router.get("/accountants", (req, res) => {
    query.getAccountants()
      .then(accountants => res.json(accountants))
  });

  router.get("/user", (req, res) => {
    query.getAccountants()
      .then(accountants => res.json(accountants))
  });


  router.get("/user/categories/list/:email", (req, res) => {
    query.getCategoriesByUserEmail(req.params.email)
      .then(categories => res.json(categories))
  });


  router.post("/user/reciept/upload", (req, res) => {
    query.uploadReciept(
      req.body.uploadDate,
      req.body.photoName,
      req.body.categoryId,
      req.body.userId)
      .then(reciept => res.json(reciept[0]))
  });

  router.post("/user/reciepts", (req, res) => {
    query.getUserReciepts(req.body.categoryId, req.body.userId)
      .then(reciepts => res.json(reciepts)
      )
  });


  router.post("/user/change/accountnat", (req, res) => {
    query.getAcctIdByCompany(req.body.accountant)
      .then(id => {
        query.changeAccountant(id.id, req.body.categoryId)
          .then(reciepts => reciepts
          )
      })

  });



  router.put("/users/create/category", (req, res) => {
    const categoryName = req.body.name
    const email = req.body.email
    const acct_company = req.body.acct_company
    query.getFilesByUserEmail(email)
      .then(file => {
        query.getCategoryByNameAndUserID(categoryName, file[0].user_id)
          .then(category => {
            if (!category[0]) {
              if (acct_company) {
                query.getAcctIdByCompany(acct_company)
                  .then(acct_id => {
                    query.createCategory(categoryName, file[0].id, acct_id.id, file[0].user_id)
                      .then(category => res.json(category))
                      .catch(error => console.log(error))
                  });

                let params = {
                  Bucket: process.env.AWSS3_BUCKET,
                  Key: email + '/' + categoryName + '/'
                };
                s3.putObject(params, function (err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else console.log(data);           // successful response
                });
              }
            }
            else {
              res.send({ meassage: `Try again: ${categoryName} exists.`});
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
              query.createUser(name, email, hashedPassword)
                .then(user => {
                  query.createUserFile(email, user[0].id)
                    .then(jwt.sign({ id: user[0].id, name: name, email: email },
                      'secretkey', { expiresIn: 1800 }, (err, token) => { //generate token and expires in 30min
                        res.json({ id: user[0].id, name: name, email: email, token: token })
                        let params = {
                          Bucket: process.env.AWSS3_BUCKET,
                          Key: email + '/'
                        };
                        s3.putObject(params, function (err, data) {
                          if (err) console.log(err, err.stack); // an error occurred
                          else console.log(data);           // successful response
                        });
                      }))

                })
                .catch(error => console.log(error));
            }
          })
        }
        else {
          return res.send({ meassage: `Try again: ${user.email} is already registered.` });
        }
      })
  });

  const checkPassword = function (email, password) {
    return (query.getUserByEmail(email))
      .then(user => {

        if (user !== null) {
          if (bcrypt.compareSync(password, user.password)) {
            return user
          }
        } else {
          return null;
        }
      })
      .catch(error => console.log('error', error));
  };

  router.post('/user', function (req, res) {
    var token = req.body.token;
    if (!token) return
    res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, 'secretkey', function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      query.getCategoriesByUserEmail(decoded.email)
        .then(categories => {
          const userInfo = { id: decoded.id, name: decoded.name, email: decoded.email }
          res.json({ userInfo, categories })
        })
    });
  });

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    checkPassword(email, password)
      .then(user => {
        if (!user) { res.send({ meassage: `Try again: Wrong email or password.` }) }
        if (user) {
          query.getCategoriesByUserEmail(user.email)
            .then(categories => {
              jwt.sign({ id: user.id, name: user.name, email: user.email },
                'secretkey', { expiresIn: 1800 }, (err, token) => { //generate token and expires in 30min
                  res.json({ id: user.id, name: user.name, email: user.email, token })
                })
            })

        }
      }
      )
  });

  return router
}

