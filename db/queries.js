module.exports = db => ({

  createCategory(name, file_id, acct_id, user_id) {
    return db.query(
      `INSERT INTO "category"
    (name, file_id, acct_id, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`, [
      name,
      file_id,
      acct_id,
      user_id
    ]
    )
      .then(({ rows: category }) => category[0])
      .catch(error => console.log(error));
  },


  getAccountants() {
    return db.query(
      `SELECT * FROM accountants`
    )
      .then(({ rows: categories }) => categories)
      .catch(error => console.log(error));
  },


  getCategoriesByUserEmail(email) {
    return db.query(
      `SELECT category.id ,category.name, accountants.company AS accountant_company FROM category
      JOIN users ON users.id = user_id
      JOIN accountants ON accountants.id = acct_id
      WHERE users.email = $1;`, [email]
    )
      .then(({ rows: categories }) => categories)
      .catch(error => console.log(error));
  },


  getUserReciepts(categoryId, userId) {
    return db.query(
      `SELECT * FROM reciepts
      WHERE category_id = $1 AND user_id = $2;`, [categoryId, userId]
    )
      .then(({ rows: reciepts }) => reciepts)
      .catch(error => console.log(error));

  },


  changeAccountant(id, categoryId) {
    return db.query(
      `UPDATE "category"
    SET acct_id = $1
    WHERE category.id = $2
    RETURNING *;
    `, [
      id,
      categoryId
    ]
    )
      .then(({ rows: category }) => category)
      .catch(error => console.log(error));

  },


  uploadReciept(uploadDate, photoName, categoryId, userId) {
    return db.query(
      `INSERT INTO "reciepts"
    (upload_date, name, category_id, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [
      uploadDate,
      photoName,
      categoryId,
      userId
    ]
    )
      .then(({ rows: reciept }) => reciept)
      .catch(error => console.log(error));

  },


  getCategoryIdByNameAndUserEmail(name, email) {
    return db.query(
      `SELECT category.id FROM category
      JOIN users ON users.id = user_id
      WHERE category.name = $1 AND users.email = $2;`, [name, email]
    )
      .then(({ rows: id }) => id[0].id)
      .catch(error => console.log(error));
  },


  getCategoryByNameAndUserID(categoryName, user_id) {
    return db.query(
      `SELECT * FROM category
      WHERE name = $1 AND user_id = $2;`, [categoryName, user_id]
    )
      .then(({ rows: category }) => category)
      .catch(error => console.log(error));
  },


  getCategories() {
    return db.query(
      `SELECT * FROM category`
    )
      .then(({ rows: categories }) => categories)
      .catch(error => console.log(error));
  },


  getFiles() {
    return db.query(
      `SELECT * FROM files`
    )
      .then(({ rows: files }) => files)
      .catch(error => console.log(error));
  },


  getFilesByUserEmail(email) {
    return db.query(
      `SELECT * FROM files WHERE name = $1`, [
      email
    ]
    )
      .then(({ rows: files }) => files)
      .catch(error => console.log(error));
  },


  getAcctIdByCompany(company) {
    return db.query(
      `SELECT id FROM accountants WHERE company = $1`, [
      company
    ])
      .then(({ rows }) => rows[0])
      .catch(error => console.log(error));
  },


  getAccountantByEmail(email) {
    return db.query(
      `SELECT * FROM accountants WHERE email = $1`, [
      email
    ]
    )
      .then(({ rows }) => rows[0])
      .catch(error => console.log(error));
  },


  getUserByEmail(email) {
    return db.query(
      `SELECT * FROM users WHERE email = $1`, [
      email
    ]
    )
      .then(({ rows }) => rows[0])
      .catch(error => console.log(error));
  },


  getUsers() {
    return db.query(
      `SELECT * FROM users`
    )
      .then(({ rows: users }) => users)
      .catch(error => console.log(error));
  },


  getUsersCategoriesByAccountantEmail(email) {
    // get the users that gave access to the loggedin accountant
    return db.query(`
    SELECT DISTINCT users.id, users.name, users.email FROM category 
    JOIN users ON users.id = category.user_id
    JOIN accountants ON accountants.id = category.acct_id
    WHERE accountants.email = $1;
    `, [
      email
    ]
    )
      .then(users => {
        let newUsers = users.rows
        // get the user categories and add it to the user object as categories key
        return db.query(`
        SELECT category.id AS category_id, category.name AS category_name, users.id AS user_id FROM category
        JOIN users ON users.id = category.user_id
        JOIN accountants ON accountants.id = category.acct_id
        WHERE accountants.email = $1;`, [email])
          .then(data => {
            const categories = data.rows;
            for (let user of newUsers) {
              user.categories = [];
              for (let category of categories) {
                if (category.user_id === user.id) {
                  user.categories.push(category);
                }
              }
            }
            return newUsers
          })
          .then(users => users)
      })
      .then(users => users)
      .catch(error => console.log(error));
  },


  createAccountant(name, company, email, password) {
    return db.query(`
    INSERT INTO "accountants"
    (name, company, email, password)
    VALUES ($1,$2, $3, $4)
    RETURNING *;
    `, [
      name,
      company,
      email,
      password
    ]
    )
      .then(({ rows: accountant }) => accountant)
      .catch(error => console.log(error));
  },



  createUser(name, email, password) {
    return db.query(`
    INSERT INTO "users"
    (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [
      name,
      email,
      password
    ]
    )
      .then(({ rows: user }) => user)
      .catch(error => console.log(error));
  },


  createUserFile(name, user_id) {
    return db.query(`
    INSERT INTO "files"
    (name, user_id)
    VALUES ($1, $2);
    `, [
      name, user_id
    ]
    )
      .catch(error => console.log(error));
  },

})