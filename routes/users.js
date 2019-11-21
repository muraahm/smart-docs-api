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

let Busboy = require('busboy');



module.exports = (query) => {

  router.get("/files", (req, res) => {
    query.getFiles()
      .then(files => res.json(files))
  });

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

  router.put("/user/category/upload", (req, res) => {
    let newDate = new Date
    let curr_date = newDate.getDate();
    let curr_month = newDate.getMonth() + 1; //Months are zero based
    let curr_year = newDate.getFullYear();
    let m_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul", "Aug", "Sept",
      "Oct", "Nov", "Dec"];
    const upload_date = m_names[curr_month - 1] + "." + curr_date + "," + curr_year +  "_" + newDate.getTime() 

    query.getCategoryIdByNameAndUserEmail(req.body.categoryname, req.body.email)
      .then(id =>
        query.uploadReciept(
          upload_date,
          req.body.purchase_date,
          id,
          req.body.user_id)
      )

      busboy = new Busboy({ headers: req.headers });
      busboy.on('finish', function() {
        // console.log('Upload finished');
        // files are stored in req.files. In this case
        // Grabs file object from the request.
        const file = req.files.imageUpload;
        // console.log(file);
        let params = {
          Bucket: process.env.AWSS3_BUCKET,
          Key: req.body.email + '/' + req.body.categoryname + '/' + upload_date + '.jpg',
          Body: file.data
        };
        s3.putObject(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          // else console.log(data);           // successful response
        });
       });
       req.pipe(busboy);
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