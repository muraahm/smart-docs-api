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