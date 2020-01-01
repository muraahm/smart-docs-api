module.exports = db => ({

  createCategory(name, file_id, acct_id, user_id) {
    // console.log(name, file_id, acct_id, user_id)
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

  getCategoriesByUserEmail(email) {
    return db.query(
      `SELECT * FROM category
      JOIN users ON users.id = user_id
      WHERE users.email = $1;`, [email]
    )
      .then(({ rows: categories }) => categories)
      .catch(error => console.log(error));
  },

  uploadReciept(upload_date, purchase_date, category_id, user_id) {
    return db.query(
      `INSERT INTO "reciepts"
    (upload_date, purchase_date, category_id, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [
      upload_date,
      purchase_date,
      category_id,
      user_id
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