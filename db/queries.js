module.exports = db => ({

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

})